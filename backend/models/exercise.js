const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
	category: { type: String, required: true },
	ename: { type: String, required: true },
	vlink: { type: String, required: true },
	desc: { type: String, required: true },
});

module.exports = mongoose.model('Exercise', exerciseSchema);
