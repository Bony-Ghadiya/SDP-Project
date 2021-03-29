const express = require('express');

const trainerController = require('../controllers/trainer-controllers');

const router = express.Router();

router.post('/approve', trainerController.postTrainer);

router.patch('/update', trainerController.updateTrainer);

module.exports = router;
