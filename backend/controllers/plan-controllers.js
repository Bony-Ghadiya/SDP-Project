const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Trainer = require('../models/trainers');
const Trainee = require('../models/trainee');
const UserData = require('../models/userdata');
const DefaultPlan = require('../models/DefaultPlan');
const Exercise = require('../models/exercise');
const TrainerPlan = require('../models/TrainerPlan');

const getPlans = async (req, res, next) => {
	const tid = req.params.tid;
	let trainers, exe, plans, createdPlan, tplan, tes;
	try {
		exe = await UserData.findOne({ traineeid: tid });
		trainers = await DefaultPlan.find({}).populate('plan.exercises.exerciseid');
		tes = await Trainee.findById(tid).populate('trainerid');
		tplan = await TrainerPlan.findOne({ traineeid: tid });
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Fetching trainers failed, please try again later.',
			500
		);
		return next(error);
	}
	try {
		plans = trainers.filter(p1 => p1.gender === exe.gender);
		plans = plans.filter(p1 => p1.goal === exe.goal);
		plans = plans.filter(p1 => p1.difficulty === exe.difficulty);
		plans = plans.filter(p1 => p1.pushups === exe.pushups);
		plans = plans.filter(p1 => p1.workout === exe.workout);
		plans = plans.filter(p1 => p1.strength === exe.strength);
		plans = plans.filter(p1 => p1.time === exe.time);
		console.log('0', plans[0].plan);
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'filtering trainers failed, please try again later.',
			500
		);
		return next(error);
	}

	if (!tplan) {
		try {
			createdPlan = new TrainerPlan({
				traineeid: tid,
				traineeuserid: tes.userid,
				trainerid: tes.trainerid.id,
				traineruserid: tes.trainerid.userid,
				plan: plans[0].plan,
			});
			console.log('created', createdPlan);
			console.log('plan', createdPlan.plan);
		} catch (err) {
			console.log(err);
			const error = new HttpError(
				'creating trainers failed, please try again later.',
				500
			);
			return next(error);
		}

		try {
			const sess = await mongoose.startSession();
			sess.startTransaction();
			await createdPlan.save({ session: sess });
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
			defaultexercise: createdPlan.toObject({ getters: true }),
		});
	} else {
		res.json({
			defaultexercise: plans[0].toObject({ getters: true }),
		});
	}
};

const getPlans1 = async (req, res, next) => {
	const tid = req.params.tid;
	let trainers, exe, plans, createdPlan, tplan, tes;
	try {
		exe = await UserData.findOne({ traineeid: tid });
		trainers = await TrainerPlan.find({ traineeid: tid }).populate(
			'plan.exercises.exerciseid'
		);
		tes = await Trainee.findById(tid).populate('trainerid');
		console.log('trainers', trainers);
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Fetching trainers failed, please try again later.',
			500
		);
		return next(error);
	}

	res.json({
		defaultexercise: trainers[0].toObject({ getters: true }),
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

const getExercise = async (req, res, next) => {
	const { exerciseid, reps, time } = req.body;
	console.log(exerciseid, reps, time);
	let exe, temp;
	try {
		exe = await Exercise.findById(exerciseid);
		temp = {
			reps: reps,
			time: time,
			exerciseid: exerciseid,
		};
	} catch (err) {
		console.log(err);
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

const saveDay = async (req, res, next) => {
	const { day, traineeid, exercise } = req.body;
	console.log(exercise.length);
	console.log('save day');
	let plans, abc, temp;
	try {
		plans = await TrainerPlan.findOne({ traineeid: traineeid }).populate(
			'plan.exercise.exerciseid'
		);
		// abc = plans.plan.filter(p => p.dayNo === day);
		// console.log(abc);

		// abc.exercises = exercise;

		var i,
			j,
			k = 0,
			l;

		for (i = 0; i < plans.plan.length; i++) {
			l = plans.plan[i].exercises.length;
			if (plans.plan[i].dayNo === day) {
				plans.plan[i].isSaved = 1;
				for (j = 0; j < l; j++) {
					plans.plan[i].exercises.pop();
				}
				for (j = 0; j < exercise.length; j++) {
					plans.plan[i].exercises.push(exercise[[k++]]);
				}
				// plans.plan.exercises = exercise;
			}
		}

		console.log('plans', plans.plan);
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Something went wrong, could not find data.',
			500
		);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await plans.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		console.log(err);
	}

	res.json({ defaultexercise: plans.toObject({ getters: true }) });
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
exports.getExercise = getExercise;
exports.saveDay = saveDay;
exports.getPlans1 = getPlans1;
