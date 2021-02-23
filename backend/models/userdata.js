const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userdataSchema = new Schema({
	userid: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
	gender: { type: String, required: true },
	goal: { type: String, required: true },
	time: { type: String, required: true },
	strength: { type: String, required: true },
	pushups: { type: String, required: true },
	workout: { type: String, required: true },
	difficulty: { type: String, required: true },
	values: {
		height: { type: Number, required: true },
		weight: { type: Number, required: true },
		age: { type: Number, required: true },
	},
	trainerid: { type: mongoose.Types.ObjectId, ref: 'Trainers' },
	traineeid: { type: mongoose.Types.ObjectId, ref: 'Trainees' },
});

// module.exports = mongoose.model('User', userSchema);
global.userdataSchema =
	global.userdataSchema || mongoose.model('UserData', userdataSchema);
module.exports = global.userdataSchema;
