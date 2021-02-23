const express = require('express');

const { check } = require('express-validator');

const adminController = require('../controllers/admin-controllers');

const router = express.Router();

router.get('/approvetrainers', adminController.getRequests);

router.patch(
	'/approvetrainers',
	[check('tituseridle').not().isEmpty()],
	adminController.approve
);

router.delete('/approvetrainers', adminController.decline);

module.exports = router;
