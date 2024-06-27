const asyncHandler = require("express-async-handler");
const exercise = require("../models/exerciseModel");
const user = require("../models/userModel");
const { getUserDetail } = require("./userController");
const { isValidDate } = require("../middleware/validateDate");
const { checkValidFormField } = require("../middleware/validateFormField");
const moment = require("moment");
const { STATUS_CODE } = require("../const/httpStatusCode");

// Adding the Exercises
const addExercise = asyncHandler(async (req, res) => {
  const exerciseObj = {
    ...req.body,
    userId: req.params._id,
    date: req.body.date || moment(),
  };
  const isValidForm = checkValidFormField(exerciseObj);
  if (Object.entries(isValidForm).length === 0) {
    const { username } = await user.findById(req.params._id);
    let { userId, description, duration, date } = await exercise.create(
      exerciseObj
    );
    res.json({ _id: userId, username, description, duration, date });
  } else {
    res.status(STATUS_CODE.CLIENT_ERROR_RESPONSE_CODE).json(isValidForm);
  }
});

const getExercises = asyncHandler(async (req, res) => {
  const { _id, username } = await getUserDetail(req.params._id);

  const { from = "", to = "", limit = "", page = "" } = req?.query;

  console.log(isValidDate);

  const { exercises, totalCount } = await getUserExercises(
    _id,
    from,
    to,
    limit,
    page
  );

  const result = {
    _id,
    username,
    count: totalCount,
    logs: exercises,
  };

  res.json(result);
});

const getUserExercises = async (userId, from, to, limit, page) => {
  const query = { userId };

  if (from) {
    query.date = { $gte: new Date(from) };
  }

  if (to) {
    query.date = query.date || {};
    query.date.$lte = new Date(new Date(to).setHours(23, 59, 59, 999));
  }

  let exerciseQuery = exercise.find(query);

  const limitValue = limit ? parseInt(limit) : 10;
  const pageValue = page ? parseInt(page) : 1;

  const skipValue = (pageValue - 1) * limitValue;

  exerciseQuery = exerciseQuery.skip(skipValue).limit(limitValue);

  const exercises = await exerciseQuery.exec();
  const totalCount = await exercise.countDocuments(query);

  return { exercises, totalCount };
};

module.exports = {
  addExercise,
  getExercises,
  getUserExercises,

};
