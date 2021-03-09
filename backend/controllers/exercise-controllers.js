const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const User = require('../models/User');
const Trainer = require('../models/trainers');
const Trainees = require('../models/trainee');
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
	const { tuid, day } = req.body;
	console.log(tuid);

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

				if (trainers.plan[i].dayNo !== 30) {
					trainers.plan[i + 1].previousDayComplated = 1;
					console.log('updated');
				}
			}
		}
		if (day === 7) {
			trainers.week1Submitted = 1;
		} else if (day === 14) {
			trainers.week2Submitted = 1;
		} else if (day === 21) {
			trainers.week3Submitted = 1;
		} else if (day === 28) {
			trainers.week4Submitted = 1;
		}
		plans.traineeDay = day;
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

exports.viewPlan = viewPlan;
exports.completeZero = completeZero;
