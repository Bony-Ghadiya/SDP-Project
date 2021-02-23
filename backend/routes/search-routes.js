const express = require("express");

const searchController = require("../controllers/search-controllers");

const router = express.Router();

router.get("/", searchController.getExercises);

router.get("/:eid", searchController.getExercisebyId);

module.exports = router;
