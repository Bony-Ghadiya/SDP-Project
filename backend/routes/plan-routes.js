const express = require('express');

const planController = require('../controllers/plan-controllers');

const router = express.Router();

router.post('/plan', planController.saveData);

router.patch('/plan/getExercise', planController.getExercise);

router.get('/getdetails/:tid', planController.getDetails);

router.get('/getdefaultplan/:tid', planController.getPlans);

router.get('/getdefaultplan1/:tid', planController.getPlans1);

router.patch('/saveday', planController.saveDay);

router.patch('/savereps', planController.saveReps);

router.patch('/resetday/:tid', planController.resetDay);

router.get('/resetall/:tid', planController.resetAll);

router.patch('/submit', planController.submit);

module.exports = router;
