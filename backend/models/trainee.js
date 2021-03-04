const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const traineeSchema = new Schema({
	userid: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
	name: { type: String, required: true },
	image: { type: String, required: true },
	trainerid: { type: mongoose.Types.ObjectId, ref: 'Trainers' },
	isDataGiven: { type: Number, default: 0 },
});

global.traineeSchema =
	global.traineeSchema || mongoose.model('Trainees', traineeSchema);
module.exports = global.traineeSchema;
