const Order = require('../models/order.model');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validIfExistOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({
    where: {
      id,
      status: 'active',
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

  if (!meal) {
    return next(new AppError('Order not found', 404));
  }

  req.user = order.user;
  req.order = order;
  next();
});
