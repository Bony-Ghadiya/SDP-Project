const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const Trainer = require('../models/trainers');
const Trainees = require('../models/trainee');

const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key:
				'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',
		},
	})
);

const getUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, '-password');
	} catch (err) {
		const error = new HttpError(
			'Fetching users failed, please try again later.',
			500
		);
		return next(error);
	}
	res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}

	const { name, email, password, userType } = req.body;

	let existingUser, trainer;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			'Signing up failed, please try again later.',
			500
		);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError(
			'User exists already, please login instead.',
			422
		);
		return next(error);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		const error = new HttpError(
			'Could not create user, please try again.',
			500
		);
		return next(error);
	}

	let createdUser;
	try {
		if (req.file) {
			createdUser = new User({
				name,
				email,
				image: req.file.path,
				password: hashedPassword,
				userType,
			});
		}
	} catch (err) {
		console.log(err);
	}

	try {
		if (req.file) {
			await createdUser.save();
		}
	} catch (err) {
		const error = new HttpError(
			'Signing up failed, please try again later.',
			500
		);
		console.log(err);
		return next(error);
	}

	let token;
	try {
		if (req.file) {
			token = jwt.sign(
				{
					userId: createdUser.id,
					email: createdUser.email,
					userType: createdUser.userType,
					image: createdUser.image,
				},
				'supersecret_dont_share',
				{ expiresIn: '1h' }
			);
		}
	} catch (err) {
		const error = new HttpError(
			'Signing up failed, please try again later.',
			500
		);
		console.log(err);
		return next(error);
	}
	transporter.sendMail({
		to: createdUser.email,
		from: 'mgediya00@gmail.com',
		subject: 'signup success',
		html: `<h1>welcome</h1>`,
	});

	res.json({
		userId: createdUser.id,
		email: createdUser.email,
		userType: createdUser.userType,
		image: createdUser.image,
		token: token,
		requested: 0,
		approved: 0,
		selected: 0,
	});
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser,
		trainer,
		trainee,
		flag = 0,
		isTrainer = 0;

	try {
		existingUser = await User.findOne({ email: email });

		if (existingUser.userType === 'trainer') {
			trainer = await Trainer.findOne({ userid: existingUser.id });
		} else if (existingUser.userType === 'user') {
			trainee = await Trainees.findOne({ userid: existingUser.id });

			flag = 1;
			if (trainee) {
				isTrainer = 1;
			}
		}
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Logging in failed, please try again later.',
			500
		);
		return next(error);
	}

	if (!existingUser) {
		const error = new HttpError(
			'Invalid credentials, could not log you in.',
			403
		);
		return next(error);
	}

	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(password, existingUser.password);
		if (isValidPassword) console.log('true');
	} catch (err) {
		const error = new HttpError(
			'Could not log you in, please check your credentials and try again.',
			500
		);
		return next(error);
	}

	if (!isValidPassword) {
		console.log('false');
		const error = new HttpError(
			'Invalid credentials, could not log you in.',
			403
		);
		return next(error);
	}

	let token;
	try {
		token = jwt.sign(
			{
				userId: existingUser.id,
				email: existingUser.email,
				userType: existingUser.userType,
			},
			'supersecret_dont_share',
			{ expiresIn: '1h' }
		);
	} catch (err) {
		const error = new HttpError(
			'Logging in failed, please try again later.',
			500
		);
		return next(error);
	}

	if (existingUser.userType === 'trainer' && trainer) {
		res.json({
			userId: existingUser.id,
			email: existingUser.email,
			userType: existingUser.userType,
			requested: trainer.requested,
			approved: trainer.approved,
			selected: 0,
			token: token,
		});
	} else if (existingUser.userType === 'user' && flag && isTrainer) {
		console.log(trainee.trainerid ? '1' : '0');
		res.json({
			userId: existingUser.id,
			email: existingUser.email,
			userType: existingUser.userType,
			requested: 0,
			approved: 0,
			selected: trainee.trainerid ? 1 : 0,
			token: token,
		});
	} else {
		res.json({
			userId: existingUser.id,
			email: existingUser.email,
			userType: existingUser.userType,
			requested: 0,
			approved: 0,
			selected: 0,
			token: token,
		});
	}
};

const resetPassword = (req, res, next) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			const error = new HttpError('token creation failed.', 500);
			return next(error);
		}
		const token1 = buffer.toString('hex');
		try {
			User.findOne({ email: req.body.email }).then(user => {
				if (!user) {
					console.log(err);
					const error = new HttpError('no user found.', 422);
					return next(error);
				}
				console.log(token1);
				user.resetToken = token1;
				user.expireToken = Date.now() + 3600 * 1000;
				try {
					user.save().then(result => {
						transporter.sendMail({
							to: user.email,
							from: 'mgediya00@gmail.com',
							subject: 'password reset',
							html: `
              <p>You requested for password reset</p>
              <h5>click in this <a href="http://localhost:3000/reset/${token1}">link</a> to reset password</h5>
              `,
						});
						res.json({ message: 'check your email' });
					});
				} catch (err) {
					console.log(err);
					const error = new HttpError(
						'Signing up failed, please try again later.',
						500
					);
					return next(error);
				}
			});
		} catch (err) {
			console.log(err);
		}
	});
};

const newPassword = (req, res, next) => {
	const newPassword = req.body.password;
	const sentToken = req.body.token;

	User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
		.then(user => {
			if (!user) {
				console.log(err);
				const error = new HttpError('Email Id is not registered.', 422);
				return next(error);
			}
			bcrypt.hash(newPassword, 12).then(hashedpassword => {
				user.password = hashedpassword;
				user.resetToken = undefined;
				user.expireToken = undefined;
				user.save().then(saveduser => {
					res.json({ message: 'password updateded successfully' });
				});
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.resetPassword = resetPassword;
exports.newPassword = newPassword;
