const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TraineePlanSchema = new Schema({
	traineeuserid: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
	trainerid: { type: mongoose.Types.ObjectId, ref: 'Trainers' },
	traineeid: { type: mongoose.Types.ObjectId, ref: 'Trainees' },
	traineruserid: { type: mongoose.Types.ObjectId, ref: 'User' },
	isComplate: { type: Number, default: 0 },
	plan: [
		{
			dayNo: { type: Number, required: true },
			previousDayComplated: { type: Number, Default: 0 },
			dayComplated: { type: Number, Default: 0 },
			feedback: { type: String, Default: 'EASY' },
			exercises: [
				{
					exerciseid: {
						type: mongoose.Types.ObjectId,
						required: true,
						ref: 'Exercise',
					},
					reps: { type: Number, default: 0 },
					time: { type: Number, default: 0 },
				},
			],
		},
	],
	week1Submitted: { type: Number, default: 0 },
	week2Submitted: { type: Number, default: 0 },
	week3Submitted: { type: Number, default: 0 },
	week4Submitted: { type: Number, default: 0 },
	week1Report: {
		strength: { type: String },
		pushups: { type: String },
		weight: { type: Number },
		other: { type: String },
	},
	week2Report: {
		strength: { type: String },
		pushups: { type: String },
		weight: { type: Number },
		other: { type: String },
	},
	week3Report: {
		strength: { type: String },
		pushups: { type: String },
		weight: { type: Number },
		other: { type: String },
	},
	week4Report: {
		strength: { type: String },
		pushups: { type: String },
		weight: { type: Number },
		other: { type: String },
	},
});

module.exports = mongoose.model('TraineePlan', TraineePlanSchema);
