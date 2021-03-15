const express = require('express');

const selectController = require('../controllers/select-controllers');

const router = express.Router();

router.get('/select', selectController.getTrainers);

router.get('/select/:tid', selectController.getTrainerById);

router.get('/showtrainer/:uid', selectController.showTrainerById);

router.patch('/select/accept', selectController.acceptRequest);

module.exports = router;
