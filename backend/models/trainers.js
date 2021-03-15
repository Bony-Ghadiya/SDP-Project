const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trainerSchema = new Schema({
	userid: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
	name: { type: String, required: true },
	feedback: [{ type: String }],
	rating: { type: Number, required: true },
	startTime: { type: String, required: true },
	image: { type: String, required: true },
	endTime: { type: String, required: true },
	experience: { type: Number, required: true },
	approved: { type: Number, default: 0 },
	requested: { type: Number, default: 0 },
	trainees: [{ type: mongoose.Types.ObjectId, ref: 'Trainees' }],
	traineeCount: { type: Number, default: 0 },
});

// module.exports = mongoose.model('User', userSchema);
global.TrainerSchema =
	global.TrainerSchema || mongoose.model('Trainers', trainerSchema);
module.exports = global.TrainerSchema;
