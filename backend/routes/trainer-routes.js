const express = require('express');

const trainerController = require('../controllers/trainer-controllers');

const router = express.Router();

router.post('/approve', trainerController.postTrainer);

module.exports = router;
