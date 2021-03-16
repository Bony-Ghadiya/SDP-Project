const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const crypto = require('crypto');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const Trainer = require('../models/trainers');
const Trainees = require('../models/trainee');
const TraineePlan = require('../models/TraineePlan');

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

	const { name, email, image, password, userType } = req.body;

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
		createdUser = new User({
			name,
			email,
			image: image,
			password: hashedPassword,
			userType,
		});
	} catch (err) {
		console.log(err);
	}

	try {
		await createdUser.save();
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
		given: 0,
		complated: 0,
		fbgiven: 0,
	});
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser,
		trainer,
		trainee,
		flag = 0,
		isTrainer = 0,
		trainers;

	try {
		existingUser = await User.findOne({ email: email });
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
	} else {
		if (existingUser.userType === 'trainer') {
			trainer = await Trainer.findOne({ userid: existingUser.id });
		} else if (existingUser.userType === 'user') {
			trainee = await Trainees.findOne({ userid: existingUser.id });
			trainers = await TraineePlan.findOne({ traineeuserid: existingUser.id });
			console.log(trainers);
			flag = 1;
			if (trainee) {
				isTrainer = 1;
			}
		}
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
			given: 0,
			complated: 0,
			fbgiven: 0,
			token: token,
		});
	} else if (
		existingUser.userType === 'user' &&
		flag &&
		isTrainer &&
		!trainers
	) {
		console.log(trainee.trainerid ? '1' : '0');
		res.json({
			userId: existingUser.id,
			email: existingUser.email,
			userType: existingUser.userType,
			requested: 0,
			approved: 0,
			selected: trainee.trainerid ? 1 : 0,
			complated: 0,
			// fbgiven: 0,
			given: trainee.isDataGiven,
			token: token,
		});
	} else if (
		existingUser.userType === 'user' &&
		flag &&
		isTrainer &&
		trainers
	) {
		console.log(trainee.trainerid ? '1' : '0');
		res.json({
			userId: existingUser.id,
			email: existingUser.email,
			userType: existingUser.userType,
			requested: 0,
			approved: 0,
			selected: trainee.trainerid ? 1 : 0,
			complated: trainers.isComplate,
			// fbgiven: 0,
			given: trainee.isDataGiven,
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
			complated: 0,
			fbgiven: 0,
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

const getProfile = async (req, res, next) => {
	console.log('getProfile');
	const uid = req.params.uid;
	console.log(uid);
	let user;
	try {
		user = await User.findById(uid);
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Fetching users failed, please try again later.',
			500
		);
		return next(error);
	}

	if (!user) {
		const error = new HttpError(
			'no user found with provided id, Please check yout id',
			403
		);
		return next(error);
	}

	res.json({
		email: user.email,
		name: user.name,
		image: user.image,
		UserType: user.usertype,
	});
};

const updateProfile = async (req, res, next) => {
	console.log('updateProfile');
	let user, trainer, trainee, existingUser;
	const { email, name, uid, image } = req.body;
	console.log(email, name, uid);
	try {
		user = await User.findById(uid);
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Fetching users failed, please try again later.',
			500
		);
		return next(error);
	}

	if (!user) {
		const error = new HttpError(
			'no user found with provided id, Please check yout id',
			403
		);
		return next(error);
	} else {
		try {
			existingUser = await User.findOne({ email: email });
		} catch (err) {
			const error = new HttpError(
				'Signing up failed, please try again later.',
				500
			);
			return next(error);
		}

		if (existingUser && existingUser.id !== user.id) {
			const error = new HttpError(
				'User exists already, please choose another id.',
				422
			);
			return next(error);
		} else {
			user.email = email;
		}
		user.name = name;
		user.image = image;
		console.log(user);
		if (user.userType === 'user') {
			trainee = await Trainees.findOne({ userid: uid });
			if (trainee) {
				trainee.name = name;
				trainee.image = image;
			}
		} else if (user.userType === 'trainer') {
			trainer = await Trainer.findOne({ userid: uid });
			if (trainer) {
				trainer.name = name;
				trainer.image = image;
			}
		}
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await user.save({ session: sess });
		if (trainee) {
			await trainee.save({ session: sess });
		} else if (trainer) {
			await trainer.save({ session: sess });
		}
		await sess.commitTransaction();
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Something went wrong, could not update trainee in db.',
			500
		);
		return next(error);
	}

	res.json({
		email: user.email,
		name: user.name,
		image: user.image,
		UserType: user.usertype,
	});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.resetPassword = resetPassword;
exports.newPassword = newPassword;
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
