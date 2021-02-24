const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Trainer = require('../models/trainers');
const Trainee = require('../models/trainee');
const UserData = require('../models/userdata');

const getDetails = async (req, res, next) => {
	console.log('get details');
	const tid = req.params.tid;
	console.log(tid);
	let exe;
	try {
		exe = await UserData.findOne({ traineeid: tid });
		console.log(tid);
		console.log(exe);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find data.',
			500
		);
		return next(error);
	}

	if (!exe) {
		const error = new HttpError(
			'Could not find data for the provided id.',
			404
		);
		return next(error);
	}

	res.json({ exe: exe.toObject({ getters: true }) });
};

const saveData = async (req, res, next) => {
	const {
		userid,
		gender,
		goal,
		time,
		strength,
		pushups,
		workout,
		difficulty,
		values,
	} = req.body;
	let existingUser, createdData, existingTrainer;

	try {
		existingUser = await Trainee.findOne({ userid: userid });
		console.log('savedata');
		console.log(userid);
		console.log(existingUser);
		existingTrainer = await Trainer.findById(existingUser.trainerid);
		console.log(existingTrainer);
	} catch (err) {
		const error = new HttpError(
			'Fetching trainees failed, please try again later.',
			500
		);
		return next(error);
	}

	try {
		createdData = new UserData({
			traineeuserid: userid,
			gender,
			goal,
			time,
			strength,
			pushups,
			workout,
			difficulty,
			values,
			traineeid: existingUser.id,
			trainerid: existingUser.trainerid,
			traineruserid: existingTrainer.userid,
		});
		console.log(createdData);
	} catch (err) {
		const error = new HttpError(
			'creating data failed, please try again later.',
			500
		);
		console.log(err);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await createdData.save({ session: sess });
		await sess.commitTransaction();
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
		data: createdData.toObject({ getters: true }),
	});
};

exports.saveData = saveData;
exports.getDetails = getDetails;