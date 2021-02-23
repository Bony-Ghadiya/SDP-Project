const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, minlength: 6 },
	userType: { type: String, required: true },
	image: { type: String, required: true },
	resetToken: { type: String },
	expireToken: { type: Date },
});

userSchema.plugin(uniqueValidator);

// module.exports = mongoose.model('User', userSchema);
global.UserSchema = global.UserSchema || mongoose.model('User', userSchema);
module.exports = global.UserSchema;
