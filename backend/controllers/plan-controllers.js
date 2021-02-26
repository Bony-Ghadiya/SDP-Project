const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Trainer = require('../models/trainers');
const Trainee = require('../models/trainee');
const UserData = require('../models/userdata');
const DefaultPlan = require('../models/DefaultPlan');

const getPlans = async (req, res, next) => {
	let trainers;
	try {
		trainers = await DefaultPlan.find({}).populate('plan.exercises.exerciseid');
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Fetching trainers failed, please try again later.',
			500
		);
		return next(error);
	}
	res.json({
		defaultexercise: trainers.map(t => t.toObject({ getters: true })),
	});
};

const getDetails = async (req, res, next) => {
	const tid = req.params.tid;
	let exe;
	try {
		exe = await UserData.findOne({ traineeid: tid });
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
	let existingUser, createdData, existingTrainer, createdPlan;

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
		// createdPlan = new DefaultPlan({
		// 	gender,
		// 	goal,
		// 	time,
		// 	strength,
		// 	pushups,
		// 	workout,
		// 	difficulty,
		// 	plan: [
		// 		{
		// 			dayNo: '1',
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '5' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '5' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '10' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '30' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '2',
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '8' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '5' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '11' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '30' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '3',
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '5' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '8' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '12' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '30' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '4',
		// 			exercises: [],
		// 		},
		// 		{
		// 			dayNo: '5',
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '7' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '5' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '12' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '35' },
		// 			],
		// 		},
		// 	],
		// });
		// console.log(createdPlan);
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
		// await createdPlan.save({ session: sess });
		await sess.commitTransaction();
		console.log('saved');
	} catch (err) {
		console.log(err);
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
exports.getPlans = getPlans;
