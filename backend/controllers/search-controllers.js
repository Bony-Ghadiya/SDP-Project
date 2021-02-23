const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Exercise = require("../models/exercise");

const getExercises = async (req, res, next) => {
	let exercises;
	try {
		exercises = await Exercise.find({}, "-upby");
	} catch (err) {
		const error = new HttpError(
			"Fetching Exercises failed, please try again later.",
			500
		);
		return next(error);
	}
	res.json({
		exercises: exercises.map(exe => exe.toObject({ getters: true })),
	});
};

const getExercisebyId = async (req, res, next) => {
	const eid = req.params.eid;
	console.log(eid);
	let exe;
	try {
		exe = await Exercise.findById(eid, "-upby");
		console.log(eid);
		console.log(exe);
	} catch (err) {
		const error = new HttpError(
			"Something went wrong, could not find an exercise.",
			500
		);
		return next(error);
	}

	if (!exe) {
		const error = new HttpError(
			"Could not find Exercise for the provided id.",
			404
		);
		return next(error);
	}

	res.json({ exe: exe.toObject({ getters: true }) });
};

exports.getExercises = getExercises;
exports.getExercisebyId = getExercisebyId;
