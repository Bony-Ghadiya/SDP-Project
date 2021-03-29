const express = require('express');

const counterController = require('../controllers/counter-controllers');

const router = express.Router();

router.patch('/trainers', counterController.checkTrainer);

module.exports = router;
