const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');
const usersRoutes = require('./routes/user-routes');
const searchRoutes = require('./routes/search-routes');
const selectRoutes = require('./routes/select-routes');
const trainerRoutes = require('./routes/trainer-routes');
const adminRoutes = require('./routes/admin-routes');
const showRoutes = require('./routes/show-routes');
const planRoutes = require('./routes/plan-routes');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

	next();
});

app.use('/api/users', usersRoutes);

app.use('/api/search', searchRoutes);

app.use('/api/selectTrainer', selectRoutes);

app.use('/api/trainers', trainerRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/show', showRoutes);

app.use('/api/getplan', planRoutes);

app.use((req, res, next) => {
	const error = new HttpError('Could not find this route.', 404);
	throw error;
});

app.use((error, req, res, next) => {
	if (req.file) {
		fs.unlink(req.file.path, err => {
			console.log(err);
		});
	}
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
	.connect(
		`mongodb+srv://SDPUser:SDPUser@cluster0.ifcub.mongodb.net/gym_exercise_planner?retryWrites=true&w=majority`
	)
	.then(() => {
		app.listen(5000);
	})
	.catch(err => {
		console.log(err);
	});
