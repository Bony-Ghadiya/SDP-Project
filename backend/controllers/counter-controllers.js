const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/User');
const Trainer = require('../models/trainers');

const checkTrainer = async (req, res, next) => {
	const { userid } = req.body;
	let existingUser;
	console.log('counter');

	try {
		existingUser = await Trainer.findOne({ userid: userid });
	} catch (err) {
		const error = new HttpError(
			'Fetching trainers failed, please try again later.',
			500
		);
		return next(error);
	}

	if (!existingUser) {
		res.json({
			approved: 999,
		});
	} else {
		res.json({
			approved: existingUser.approved,
		});
	}
};

exports.checkTrainer = checkTrainer;
