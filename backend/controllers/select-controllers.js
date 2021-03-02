const { validationResult } = require('express-validator');

const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const User = require('../models/User');
const Trainer = require('../models/trainers');
const Trainees = require('../models/trainee');

const getTrainers = async (req, res, next) => {
	let trainers;
	try {
		trainers = await Trainer.find({ approved: 1 }).populate('userid');
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

const getTrainerById = async (req, res, next) => {
	console.log('trainer');
	const tid = req.params.tid;
	console.log(tid);

	let exe;
	try {
		exe = await Trainer.findById(tid);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find the trainer.',
			500
		);
		return next(error);
	}

	if (!exe) {
		const error = new HttpError(
			'Could not find trainer for the provided id.',
			404
		);
		return next(error);
	}

	res.json({ trainer: exe.toObject({ getters: true }) });
};

const acceptRequest = async (req, res, next) => {
	const { userid, trainerid } = req.body;

	console.log('accept trainer');
	console.log(userid, trainerid);
	let trainer, user, createdTrainees;
	try {
		trainer = await Trainer.findById(trainerid).populate('userid');
		user = await User.findById(userid);
		console.log(trainer);
		console.log(user);
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Something went wrong, could not update trainer.',
			500
		);
		return next(error);
	}

	try {
		createdTrainees = new Trainees({
			userid: userid,
			name: user.name,
			image: user.image,
			trainerid: trainerid,
			isDataGiven: 0,
		});
	} catch (err) {
		const error = new HttpError(
			'creating data failed, please try again later.',
			500
		);
		console.log(err);
		return next(error);
	}

	console.log(createdTrainees);

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await createdTrainees.save({ session: sess });
		trainer.trainees.push(createdTrainees);
		await trainer.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Something went wrong, could not update trainee in db.',
			500
		);
		return next(error);
	}

	// transporter.sendMail({
	// 	to: byid.userid.email,
	// 	from: 'mgediya00@gmail.com',
	// 	subject: 'request for Trainer',
	// 	html: '<h1>your request  has been approved</h1>',
	// });

	res.json({
		trainers: trainer.toObject({ getters: true }),
	});
};

exports.getTrainers = getTrainers;
exports.getTrainerById = getTrainerById;
exports.acceptRequest = acceptRequest;
