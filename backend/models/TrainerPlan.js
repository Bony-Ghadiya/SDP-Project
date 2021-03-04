const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TrainerPlanSchema = new Schema({
	traineeuserid: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
	trainerid: { type: mongoose.Types.ObjectId, ref: 'Trainers' },
	traineeid: { type: mongoose.Types.ObjectId, ref: 'Trainees' },
	traineruserid: { type: mongoose.Types.ObjectId, ref: 'User' },
	isComplate: { type: Number, default: 0 },
	traineeDay: { type: Number, default: 0 },
	plan: [
		{
			dayNo: { type: Number, required: true },
			isSaved: { type: Number, Default: 0 },
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
});

global.TrainerPlanSchema =
	global.TrainerPlanSchema || mongoose.model('TrainerPlan', TrainerPlanSchema);
module.exports = global.TrainerPlanSchema;
