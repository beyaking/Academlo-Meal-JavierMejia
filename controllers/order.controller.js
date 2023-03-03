const Meal = require('../models/meal.model');
const Order = require('../models/order.model');
const Restaurant = require('../models/restaurant.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body;

  const order = await Order.create({ quantity, mealId });

  res.status(201).json({
    status: 'success',
    message: 'Your order was created',
    order,
  });
});

exports.getOrdersByUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
    where: {
      userId: sessionUser.id,
      status: 'active',
    },
    includes: [
      {
        model: Meal,
        where: {
          status: 'active',
        },
        includes: [
          {
            model: Restaurant,
            where: {
              status: true,
            },
          },
        ],
      },
    ],
  });

  res.status(200).json({
    orders,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'completed' });

  res.status(200).json({
    status: 'success',
    message: 'Your order was completed',
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  await order.update({ status: 'cancelled' });

  res.status(200).json({
    status: 'success',
    message: 'Your order was cancelled',
  });
});

exports.buyMealOnOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const charge = await Order.findOne({
    where: {
      userId: sessionUser.id,
      status: 'active',
    },
    include: [
      {
        model: Meal,
        where: {
          status: 'active',
        },
      },
    ],
  });

  if (!charge) {
    return next(new AppError('There are not meals in your order', 400));
  }

  let totalPrice = 0;

  charge.orders.forEach(order => {
    totalPrice += order.quantity * order.meal.price;
  });

  await charge.update({ status: 'purchased' });

  const order = await Order.create({
    userId: sessionUser.id,
    mealId: charge.id,
    totalPrice,
  });

  res.status(201).json({
    message: 'Your order has been generated successfully',
    order,
  });
});
