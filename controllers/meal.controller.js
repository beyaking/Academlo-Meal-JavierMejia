const Meal = require('../models/meal.model');
const Restaurant = require('../models/restaurant.model');
const catchAsync = require('../utils/catchAsync');

exports.createMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;

  const meal = await Meal.create({ name, price });

  res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    meal,
  });
});

exports.getMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    where: {
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

  res.status(200).json({
    status: 'success',
    meals,
  });
});

exports.getMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  res.status(200).json({
    status: 'success',
    message: 'Category fetched successfully',
    meal,
  });
});

exports.updateMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { meal } = req;

  await meal.update({ name, price });

  res.status(200).json({
    status: 'success',
    message: 'Restaurant updated successfully',
  });
});

exports.deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await meal.update({ status: 'deleted' });

  res.status(200).json({
    status: 'success',
    message: 'Restaurant was disactived successfully',
  });
});
