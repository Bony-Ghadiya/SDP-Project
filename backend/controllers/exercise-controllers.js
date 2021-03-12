const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const UserData = require('../models/userdata');
const User = require('../models/User');
const Trainer = require('../models/trainers');
const Trainee = require('../models/trainee');
const TraineePlan = require('../models/TraineePlan');
const TrainerPlan = require('../models/TrainerPlan');

const viewPlan = async (req, res, next) => {
	const tuid = req.params.tuid;
	console.log(tuid);

	let trainers;
	try {
		trainers = await TraineePlan.find({ traineeuserid: tuid }).populate(
			'plan.exercises.exerciseid'
		);
		console.log(trainers);
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Fetching plans failed, please try again later.',
			500
		);
		return next(error);
	}
	if (trainers.length === 0) {
		res.json({
			defaultexercise: null,
		});
	} else {
		res.json({
			defaultexercise: trainers[0].toObject({ getters: true }),
		});
	}
};

const completeZero = async (req, res, next) => {
	console.log('complete Zero');
	const { tuid, day, fb } = req.body;
	console.log(tuid, fb);

	let trainers, plans;
	try {
		trainers = await TraineePlan.findOne({ traineeuserid: tuid }).populate(
			'plan.exercises.exerciseid'
		);
		plans = await TrainerPlan.findOne({ traineeuserid: tuid }).populate(
			'plan.exercises.exerciseid'
		);
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Fetching plans failed, please try again later.',
			500
		);
		return next(error);
	}

	try {
		var i;
		for (i = 0; i < trainers.plan.length; i++) {
			if (trainers.plan[i].dayNo === day) {
				trainers.plan[i].dayComplated = 1;
				if (fb === 1) {
					trainers.plan[i].feedback = 'EASY';
				} else if (fb === 5) {
					trainers.plan[i].feedback = 'JUST RIGHT';
				} else if (fb === 10) {
					trainers.plan[i].feedback = 'TOO HARD';
				}
				if (trainers.plan[i].dayNo !== 30) {
					trainers.plan[i + 1].previousDayComplated = 1;
					console.log('updated');
				}
			}
		}
		plans.traineeDay = day + 1;
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'updating plans failed, please try again later.',
			500
		);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await trainers.save({ session: sess });
		await plans.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Something went wrong, could not update trainee in db.',
			500
		);
		return next(error);
	}

	res.json({ defaultexercise: trainers.toObject({ getters: true }) });
};

const getFeedback = async (req, res, next) => {
	console.log('feedback');
	const tid = req.params.tid;
	console.log(tid);
	let trainers;
	try {
		trainers = await TraineePlan.find({ traineeid: tid }).populate(
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
	if (trainers) {
		res.json({
			defaultexercise: trainers[0].toObject({ getters: true }),
		});
	} else {
		res.json({
			message: ' please provide the plan first.',
		});
	}
};
const giveReporting = async (req, res, next) => {
	console.log('giveReporting');
	const { userid, week, strength, pushups, weight, other } = req.body;
	console.log(userid);

	let trainers;
	try {
		trainers = await TraineePlan.findOne({
			traineeuserid: userid,
		}).populate('plan.exercises.exerciseid');
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Fetching plans failed, please try again later.',
			500
		);
		return next(error);
	}

	try {
		if (week === 1) {
			console.log('week1');
			trainers.week1Submitted = 1;
			trainers.week1Report.strength = strength;
			trainers.week1Report.pushups = pushups;
			trainers.week1Report.weight = weight;
			trainers.week1Report.other = other;
		} else if (week === 2) {
			trainers.week2Submitted = 1;
			trainers.week2Report.strength = strength;
			trainers.week2Report.pushups = pushups;
			trainers.week2Report.weight = weight;
			trainers.week2Report.other = other;
		} else if (week === 3) {
			trainers.week3Submitted = 1;
			trainers.week3Report.strength = strength;
			trainers.week3Report.pushups = pushups;
			trainers.week3Report.weight = weight;
			trainers.week3Report.other = other;
		} else if (week === 4) {
			trainers.week4Submitted = 1;
			trainers.week4Report.strength = strength;
			trainers.week4Report.pushups = pushups;
			trainers.week4Report.weight = weight;
			trainers.week4Report.other = other;
			trainers.isComplate = 1;
		}
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'updating plans failed, please try again later.',
			500
		);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await trainers.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Something went wrong, could not update trainee in db.',
			500
		);
		return next(error);
	}
	res.json({ message: ' okay', success: 1 });
	// res.json({ defaultexercise: trainers.toObject({ getters: true }) });
};

const showReporting = async (req, res, next) => {
	console.log('showReporting');
	const tid = req.params.tuid;
	console.log(tid);
	let trainers;
	try {
		trainers = await TraineePlan.find({ traineeid: tid }).populate(
			'plan.exercises.exerciseid'
		);
		console.log(trainers);
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Fetching trainers failed, please try again later.',
			500
		);
		return next(error);
	}
	if (trainers.length !== 0) {
		res.json({
			defaultexercise: trainers[0].toObject({ getters: true }),
		});
	} else {
		res.json({
			message: ' please provide the plan first.',
		});
	}
};
const TrainerFeedback = async (req, res, next) => {
	console.log(' trainer feedback');
	const { userid, rating, feedback } = req.body;
	console.log(userid, rating, feedback);
	let trainee, trainer, trainerplan, traineeplan, userdata;
	try {
		trainee = await Trainee.findOne({ userid: userid });
		if (trainee) {
			trainer = await Trainer.findById(trainee.trainerid);
			traineeplan = await TraineePlan.findOne({ traineeuserid: userid });
			trainerplan = await TrainerPlan.findOne({ traineeuserid: userid });
			userdata = await UserData.findOne({ traineeuserid: userid });
			console.log(traineeplan, trainerplan);
		}
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Fetching trainers failed, please try again later.',
			500
		);
		return next(error);
	}

	try {
		trainer.rating =
			(trainer.rating * trainer.feedback.length + rating) /
			(trainer.feedback.length + 1);
		trainer.feedback = [...trainer.feedback, feedback];
		trainer.trainees.pull(trainee.id);
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'updating trainers failed, please try again later.',
			500
		);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await trainee.remove({ session: sess });
		await trainer.save({ session: sess });
		await trainerplan.remove({ session: sess });
		await traineeplan.remove({ session: sess });
		await userdata.remove({ session: sess });

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
		message: ' mast.',
		success: 1,
	});
};
exports.viewPlan = viewPlan;
exports.completeZero = completeZero;
exports.getFeedback = getFeedback;
exports.giveReporting = giveReporting;
exports.showReporting = showReporting;
exports.TrainerFeedback = TrainerFeedback;
