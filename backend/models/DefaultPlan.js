const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const defaultPlanSchema = new Schema({
	gender: { type: String, required: true },
	goal: { type: String, required: true },
	time: { type: String, required: true },
	strength: { type: String, required: true },
	pushups: { type: String, required: true },
	workout: { type: String, required: true },
	difficulty: { type: String, required: true },
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

module.exports = mongoose.model('DefaultPlan', defaultPlanSchema);
