const express = require('express');

const planController = require('../controllers/plan-controllers');

const router = express.Router();

router.post('/plan', planController.saveData);

router.get('/getdetails/:tid', planController.getDetails);

module.exports = router;