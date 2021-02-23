const express = require('express');

const planController = require('../controllers/plan-controllers');

const router = express.Router();

router.post('/plan', planController.saveData);

module.exports = router;
