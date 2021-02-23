const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const fs = require('fs');

const HttpError = require('../models/http-error');
const User = require('../models/User');
const Trainer = require('../models/trainers');

const transporter = nodemailer.createTransport(
	sendgridTransport({
		auth: {
			api_key:
				'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',
		},
	})
);

const getRequests = async (req, res, next) => {
	let trainers;
	try {
		trainers = await Trainer.find({ approved: 0 }).populate('userid');
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Fetching trainers failed, please try again later.',
			500
		);
		return next(error);
	}
	res.json({
		trainers: trainers.map(t => t.toObject({ getters: true })),
	});
};

const approve = async (req, res, next) => {
	const { userid, approved } = req.body;

	console.log('update');
	console.log(userid);
	let trainer, byid, abc;
	try {
		byid = await Trainer.findById(userid).populate('userid');
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not update trainer.',
			500
		);
		return next(error);
	}

	byid.approved = 1;

	try {
		await byid.save();
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Something went wrong, could not update trainer in db.',
			500
		);
		return next(error);
	}

	console.log(byid.userid.email);

	transporter.sendMail({
		to: byid.userid.email,
		from: 'mgediya00@gmail.com',
		subject: 'request for Trainer',
		html: '<h1>your request  has been approved</h1>',
	});

	res.json({
		trainers: byid.toObject({ getters: true }),
	});
};

const decline = async (req, res, next) => {
	console.log('delete');
	let trainer, user;
	console.log(req.body);
	const { userid } = req.body;
	console.log('id', userid);

	try {
		trainer = await Trainer.findById(userid);
		user = await User.find({ id: trainer.userid }).populate('userid');
		user = await User.findById(trainer.userid).populate('userid');
		console.log(trainer.userid);
		console.log(user);
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Something went wrong, could not update trainer.',
			500
		);
		return next(error);
	}

	const imagePath = trainer.image;

	try {
		await trainer.remove();
		await user.remove();
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not delete user.',
			500
		);
		return next(error);
	} finally {
		console.log('deleted');
	}

	fs.unlink(imagePath, err => {
		console.log(err);
	});

	transporter.sendMail({
		to: user.email,
		from: 'mgediya00@gmail.com',
		subject: 'request for Trainer',
		html: '<h1>your request  has been decline</h1>',
	});
	res.json('okay');
};

exports.getRequests = getRequests;
exports.approve = approve;
exports.decline = decline;
