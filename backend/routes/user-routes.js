const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/user-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
	'/signup',
	fileUpload.single('image'),
	[
		check('name').not().isEmpty(),
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({ min: 6 }),
	],
	usersController.signup
);

router.get('/getprofile/:uid', usersController.getProfile);

router.patch(
	'/updateprofile',
	[check('name').not().isEmpty(), check('email').normalizeEmail().isEmail()],
	usersController.updateProfile
);
router.post('/login', usersController.login);

router.post('/reset-password', usersController.resetPassword);

router.post('/new-password', usersController.newPassword);

module.exports = router;
