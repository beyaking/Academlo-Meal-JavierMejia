const Restaurant = require('../models/restaurant.model');
const Review = require('../models/review.model');
const catchAsync = require('../utils/catchAsync');

exports.createNewRestaurat = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const restaurant = await Restaurant.create({ name, address, rating });

  res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    restaurant,
  });
});

exports.getRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: {
      status: true,
    },
    include: [
      {
        model: Review,
        where: {
          status: true,
        },
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    restaurants,
  });
});

exports.getRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  res.status(200).json({
    status: 'success',
    message: 'The product found was successfully',
    restaurant,
  });
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
  const { name, address } = req.body;
  const { restaurant } = req;

  await restaurant.update({ name, address });

  res.status(200).json({
    status: 'success',
    message: 'Restaurant updated successfully',
  });
});

exports.deleteRestaurat = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await restaurant.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'Restaurant has been disactived successfully',
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { restaurant, sessionUser } = req;

  const review = await Review.create({
    userId: sessionUser.id,
    comment,
    restaurantId: restaurant.id,
    rating,
  });

  res.status(201).json({
    status: 'success',
    message: 'Your review was created successfully',
    review,
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const { review } = req;
  const { comment, rating } = req.body;

  await review.update({ comment, rating });

  res.status(200).json({
    status: 'success',
    message: 'Your review has been updated',
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'Your review has been deleted',
  });
});
