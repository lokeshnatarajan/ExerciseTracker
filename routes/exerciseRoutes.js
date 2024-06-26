const express = require("express");
const {
  addExercise,
  getExercise,
  getExercises,
} = require("../controllers/exerciseController");
const router1 = express.Router();

router1.route("/:_id/exercises").post(addExercise);
router1.route("/:_id/logs").get(getExercises);

module.exports = router1;
