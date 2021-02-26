const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TrainerPlanSchema = new Schema({
	traineeuserid: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
	trainerid: { type: mongoose.Types.ObjectId, ref: 'Trainers' },
	traineeid: { type: mongoose.Types.ObjectId, ref: 'Trainees' },
	traineruserid: { type: mongoose.Types.ObjectId, ref: 'User' },
	plan: [
		{
			dayNo: { type: Number, required: true },
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

module.exports = mongoose.model('TrainerPlan', TrainerPlanSchema);
