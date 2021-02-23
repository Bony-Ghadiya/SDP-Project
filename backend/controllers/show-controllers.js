const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/User');
const Trainer = require('../models/trainers');

const getTrainees = async (req, res, next) => {
	let trainers, trainees;

	const userid = req.params.tid;
	console.log(userid);

	try {
		trainers = await Trainer.findOne({ userid: userid }).populate('trainees');
		console.log('trainers : ', trainers);
	} catch (err) {
		console.log(err);
		const error = new HttpError(
			'Fetching trainers failed, please try again later.',
			500
		);
		return next(error);
	}

	res.json({
		trainees: trainers.trainees.map(t => t.toObject({ getters: true })),
	});
};

exports.getTrainees = getTrainees;
