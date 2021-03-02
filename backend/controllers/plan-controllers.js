const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Trainer = require('../models/trainers');
const Trainee = require('../models/trainee');
const UserData = require('../models/userdata');
const DefaultPlan = require('../models/DefaultPlan');
const Exercise = require('../models/exercise');
const TrainerPlan = require('../models/TrainerPlan');
const TraineePlan = require('../models/TraineePlan');

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
	let trainers;
	try {
		trainers = await TrainerPlan.find({ traineeid: tid }).populate(
			'plan.exercises.exerciseid'
		);
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
	let plans;
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

const saveReps = async (req, res, next) => {
	const { day, traineeid, exerciseid, reps, time } = req.body;
	console.log('save reps', reps, exerciseid, time);
	let plans, abc, temp;
	try {
		plans = await TrainerPlan.findOne({ traineeid: traineeid }).populate(
			'plan.exercises.exerciseid'
		);

		var i,
			j,
			k = 0,
			l;

		for (i = 0; i < plans.plan.length; i++) {
			l = plans.plan[i].exercises.length;
			if (plans.plan[i].dayNo === day) {
				// plans.plan[i].isSaved = 1;
				// for (j = 0; j < l; j++) {
				// 	plans.plan[i].exercises.pop();
				// }
				// for (j = 0; j < exercise.length; j++) {
				// 	plans.plan[i].exercises.push(exercise[[k++]]);
				// }
				// plans.plan.exercises = exercise;
				for (j = 0; j < l; j++) {
					if (plans.plan[i].exercises[j].exerciseid.id === exerciseid) {
						console.log(plans.plan[i].exercises[j].reps);
						plans.plan[i].exercises[j].reps = reps;
						plans.plan[i].exercises[j].time = time;
					}
				}
			}
		}
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
		console.log('saved');
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Something went wrong, could not find data.',
			500
		);
		return next(error);
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
		existingTrainer = await Trainer.findById(existingUser.trainerid);
	} catch (err) {
		const error = new HttpError(
			'Fetching trainees failed, please try again later.',
			500
		);
		return next(error);
	}

	try {
		existingUser.isDataGiven = 1;
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
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '5' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '5' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '10' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '30' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '2',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '8' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '5' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '11' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '30' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '3',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '5' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '8' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '12' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '30' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '4',
		// 			isSaved: 0,
		// 			exercises: [],
		// 		},
		// 		{
		// 			dayNo: '5',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '7' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '5' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '12' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '35' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '6',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '6' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '8' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '14' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '35' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '7',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '8' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '10' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '14' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '35' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '8',
		// 			isSaved: 0,
		// 			exercises: [],
		// 		},
		// 		{
		// 			dayNo: '9',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '6' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '8' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '14' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '40' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '10',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '8' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '10' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '16' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '40' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '11',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '10' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '10' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '16' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '40' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '12',
		// 			isSaved: 0,
		// 			exercises: [],
		// 		},
		// 		{
		// 			dayNo: '13',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '12' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '8' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '16' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '45' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '14',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '10' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '14' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '18' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '45' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '15',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '15' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '15' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '18' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '45' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '16',
		// 			isSaved: 0,
		// 			exercises: [],
		// 		},
		// 		{
		// 			dayNo: '17',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '8' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '10' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '18' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '50' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '18',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '10' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '15' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '20' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '50' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '19',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '12' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '10' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '20' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '50' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '20',
		// 			isSaved: 0,
		// 			exercises: [],
		// 		},
		// 		{
		// 			dayNo: '21',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '10' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '13' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '20' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '55' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '22',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '12' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '15' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '22' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '55' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '23',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '14' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '10' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '22' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '55' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '24',
		// 			isSaved: 0,
		// 			exercises: [],
		// 		},
		// 		{
		// 			dayNo: '25',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '13' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '12' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '22' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '60' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '26',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '15' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '10' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '24' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '60' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '27',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '12' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '15' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '24' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '60' },
		// 			],
		// 		},
		// 		{
		// 			dayNo: '28',
		// 			isSaved: 0,
		// 			exercises: [],
		// 		},
		// 		{
		// 			dayNo: '29',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '15' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '13' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '24' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '60' },
		// 			],
		// 		},

		// 		{
		// 			dayNo: '30',
		// 			isSaved: 0,
		// 			exercises: [
		// 				{ exerciseid: '601a4cd6153ccdf72e174e94', reps: '15' },
		// 				{ exerciseid: '602d43f184102354900d9f44', reps: '15' },
		// 				{ exerciseid: '601a4d47153ccdf72e174e96', reps: '26' },
		// 				{ exerciseid: '602d450584102354900d9f45', time: '60' },
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
		await existingUser.save({ session: sess });
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

const resetDay = async (req, res, next) => {
	const tid = req.params.tid;
	console.log(tid);
	const { day } = req.body;
	let trainers, plans, tplan, exe;
	try {
		exe = await UserData.findOne({ traineeid: tid });
		trainers = await DefaultPlan.find({}).populate('plan.exercises.exerciseid');
		tplan = await TrainerPlan.findOne({ traineeid: tid }).populate(
			'plan.exercises.exerciseid'
		);
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
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'filtering trainers failed, please try again later.',
			500
		);
		return next(error);
	}

	try {
		let abc = plans[0].plan.filter(p => p.dayNo === day);
		abc = abc[0].exercises;
		console.log('abc', abc);

		var i,
			j,
			k = 0,
			l;

		for (i = 0; i < tplan.plan.length; i++) {
			l = tplan.plan[i].exercises.length;
			if (tplan.plan[i].dayNo === day) {
				tplan.plan[i].isSaved = 0;
				for (j = 0; j < l; j++) {
					tplan.plan[i].exercises.pop();
				}
				for (j = 0; j < abc.length; j++) {
					tplan.plan[i].exercises.push(abc[k++]);
				}
			}
		}
		const xyz = tplan.plan.filter(p => p.dayNo === day);
		console.log(xyz[0].exercises);
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Something went wrong, could not update trainers.',
			500
		);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await tplan.save({ session: sess });
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
		defaultexercise: tplan.toObject({ getters: true }),
	});
};

const resetAll = async (req, res, next) => {
	const tid = req.params.tid;
	console.log(tid);
	let trainers, exe, plans, createdPlan, tplan, tes;
	try {
		exe = await UserData.findOne({ traineeid: tid });
		trainers = await DefaultPlan.find({}).populate('plan.exercises.exerciseid');
		tes = await Trainee.findById(tid).populate('trainerid');
		tplan = await TrainerPlan.findOne({ traineeid: tid });
		console.log('1');
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
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'filtering trainers failed, please try again later.',
			500
		);
		return next(error);
	}
	try {
		createdPlan = new TrainerPlan({
			traineeid: tid,
			traineeuserid: tes.userid,
			trainerid: tes.trainerid.id,
			traineruserid: tes.trainerid.userid,
			plan: plans[0].plan,
		});
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
		tplan.remove();
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
};

const submit = async (req, res, next) => {
	console.log('submit');
	const { traineeid } = req.body;
	console.log(traineeid);

	let trainer, trainee, createdTraineePlan;
	try {
		trainer = await TrainerPlan.findOne({ traineeid: traineeid }).populate(
			'plan.exercises.exerciseid'
		);
		trainee = await TraineePlan.findOne({ traineeid: traineeid });
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Something went wrong, could not find  data.',
			500
		);
		return next(error);
	}
	if (!trainee) {
		try {
			console.log('create');
			createdTraineePlan = new TraineePlan({
				traineeid: traineeid,
				traineeuserid: trainer.traineeuserid,
				trainerid: trainer.trainerid,
				traineruserid: trainer.traineruserid,
				plan: [],
			});
		} catch (err) {
			console.log(err);
			const error = new HttpError(
				'Something went wrong, could not create plan.',
				500
			);
			return next(error);
		}

		try {
			console.log('created', createdTraineePlan);
			trainer.isComplate = 1;
			var i, j, k;
			for (i = 0; i < trainer.plan.length; i++) {
				// createdTraineePlan.plan[i].dayNo = trainer.plan[i].dayNo;
				const obj = {
					dayNo: trainer.plan[i].dayNo,
					dayComplated: 0,
					exercises: trainer.plan[i].exercises,
				};
				createdTraineePlan.plan.push(obj);
			}

			console.log('created', createdTraineePlan.plan);
		} catch (err) {
			console.log(err);
			const error = new HttpError(
				'Something went wrong, could not create plan.',
				500
			);
			return next(error);
		}

		try {
			const sess = await mongoose.startSession();
			sess.startTransaction();
			await trainer.save({ session: sess });
			await createdTraineePlan.save({ session: sess });
			await sess.commitTransaction();
		} catch (err) {
			console.log(err);
			const error = new HttpError(
				'Something went wrong, could not update trainee in db.',
				500
			);
			return next(error);
		}
		res.json({ message: 'okay' });
	} else {
		console.log(trainer.plan);
		try {
			var i, l;
			l = trainee.plan.length;
			for (i = 0; i < l; i++) {
				trainee.plan.pop();
			}
			for (i = 0; i < trainer.plan.length; i++) {
				const obj = {
					dayNo: trainer.plan[i].dayNo,
					dayComplated: 0,
					exercises: trainer.plan[i].exercises,
				};
				trainee.plan.push(obj);
			}
		} catch (err) {
			console.log(err);
			const error = new HttpError(
				'Something went wrong, could not create plan.',
				500
			);
			return next(error);
		}

		try {
			const sess = await mongoose.startSession();
			sess.startTransaction();
			await trainee.save({ session: sess });
			await sess.commitTransaction();
		} catch (err) {
			console.log(err);
			const error = new HttpError(
				'Something went wrong, could not update trainee in db.',
				500
			);
			return next(error);
		}
		res.json({ message: 'already submitted' });
	}
};

exports.saveData = saveData;
exports.getDetails = getDetails;
exports.getPlans = getPlans;
exports.getExercise = getExercise;
exports.saveDay = saveDay;
exports.getPlans1 = getPlans1;
exports.saveReps = saveReps;
exports.resetDay = resetDay;
exports.resetAll = resetAll;
exports.submit = submit;
