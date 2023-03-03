const Meal = require('../models/meal.model');
const Order = require('../models/order.model');
const Restaurant = require('../models/restaurant.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

//actualizar usuario
exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const { user } = req;

  await user.update({ name, email });

  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
  });
});

//eliminar usuario
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
});

//obtener ordenes
exports.getOrdersForUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Order.findAll({
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
        include: [
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

exports.getOrderByIdForUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;

  const order = await Order.findOne({
    where: {
      userId: sessionUser.id,
      id,
      status: 'active',
    },
    include: [
      {
        model: Meal,
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
      },
    ],
  });

  res.status(200).json({
    order,
  });
});
