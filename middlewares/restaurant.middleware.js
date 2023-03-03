const Restaurant = require('../models/restaurant.model');
const Review = require('../models/review.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validIfExistRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (!restaurant) {
    return next(new AppError('Restaurant is not found', 404));
  }

  req.restaurant = restaurant;
  next();
});

exports.validIfRestaurantId = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.params;

  const restaurant = await Restaurant.findOne({
    where: {
      id: restaurantId,
      status: true,
    },
  });

  if (!restaurant) {
    return next(new AppError('Restaurant is not found', 404));
  }

  req.restaurant = restaurant;
  next();
});
