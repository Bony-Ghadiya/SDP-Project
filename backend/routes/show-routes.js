const express = require('express');

const showController = require('../controllers/show-controllers');

const router = express.Router();

router.get('/showtrainees/:tid', showController.getTrainees);

module.exports = router;
