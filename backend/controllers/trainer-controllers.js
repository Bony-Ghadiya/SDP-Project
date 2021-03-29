const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/User');
const Trainer = require('../models/trainers');

const postTrainer = async (req, res, next) => {
	const { userid, startTime, endTime, experience } = req.body;
	let existingUser, createdTrainers;

	try {
		existingUser = await User.findOne({ _id: userid });
		console.log('app');
		console.log(userid, startTime, endTime, experience, existingUser.name);
	} catch (err) {
		const error = new HttpError(
			'Fetching trainers failed, please try again later.',
			500
		);
		return next(error);
	}

	try {
		createdTrainers = new Trainer({
			userid: userid,
			name: existingUser.name,
			rating: 0,
			feedback: [],
			startTime,
			endTime,
			experience,
			requested: 1,
			image: existingUser.image,
		});
	} catch (err) {
		const error = new HttpError(
			'creating data failed, please try again later.',
			500
		);
		console.log(err);
		return next(error);
	}

	try {
		await createdTrainers.save();
		console.log('saved');
	} catch (err) {
		const error = new HttpError(
			'Saving data failed, please try again later.',
			500
		);
		console.log(err);
		return next(error);
	}
	res.json({
		existingUser: createdTrainers.toObject({ getters: true }),
	});
};

const updateTrainer = async (req, res, next) => {
	const { userid, startTime, endTime } = req.body;
	let existingUser, createdTrainers;

	try {
		existingUser = await Trainer.findOne({ userid: userid });
		console.log('app');
		console.log(userid, startTime, endTime);
	} catch (err) {
		const error = new HttpError(
			'Fetching trainers failed, please try again later.',
			500
		);
		return next(error);
	}

	try {
		existingUser.startTime = startTime;
		existingUser.endTime = endTime;
	} catch (err) {
		const error = new HttpError(
			'creating data failed, please try again later.',
			500
		);
		console.log(err);
		return next(error);
	}

	try {
		await existingUser.save();
		console.log('saved');
	} catch (err) {
		const error = new HttpError(
			'Saving data failed, please try again later.',
			500
		);
		console.log(err);
		return next(error);
	}
	res.json({
		existingUser: existingUser.toObject({ getters: true }),
	});
};

exports.postTrainer = postTrainer;
exports.updateTrainer = updateTrainer;
