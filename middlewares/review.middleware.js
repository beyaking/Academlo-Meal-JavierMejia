const Review = require('../models/review.model');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validIfExistReview = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findOne({
    where: {
      id,
      status: true,
    },
    include: [
      {
        model: User,
        where: {
          status: true,
        },
      },
    ],
  });

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  req.review = review;
  req.user = review.user;
  next();
});
