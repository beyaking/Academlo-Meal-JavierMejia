const Meal = require('../models/meal.model');
const Restaurant = require('../models/restaurant.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validIfExistMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meal.findOne({
    where: {
      id,
      status: 'active',
    },
    include: [
      {
        model: Restaurant,
        where: {
          status: true,
        },
      },
    ],
  });

  if (!meal) {
    return next(new AppError('Meal not found', 404));
  }

  req.meal = meal;
  next();
});

exports.validBodyMealById = catchAsync(async (req, res, next) => {
  const { mealId } = req.body;

  const meal = await Meal.findOne({
    where: {
      id: mealId,
      status: 'active',
    },
  });

  if (!meal) {
    return next(new AppError('Product not found', 404));
  }

  req.meal = meal;
  next();
});
