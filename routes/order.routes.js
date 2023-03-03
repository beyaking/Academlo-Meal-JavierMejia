const { Router } = require('express');
const { check } = require('express-validator');
const {
  createOrder,
  getOrdersByUser,
  updateOrder,
  deleteOrder,
  buyMealOnOrder,
} = require('../controllers/order.controller');
const {
  protect,
  protectAccountOwner,
} = require('../middlewares/auth.middleware');
const { validBodyMealById } = require('../middlewares/meal.middleware');
const { validIfExistOrder } = require('../middlewares/order.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.use(protect);

router.post(
  '/',
  [
    check('mealId', 'MealId is required').not().isEmpty(),
    check('mealId', 'MealId is required').isNumeric(),
    check('quantity', 'quantity is required').not().isEmpty(),
    check('quantity', 'quantity is required').isNumeric(),
    validateFields,
    validBodyMealById,
  ],
  createOrder
);

router.get('/me', getOrdersByUser);

router.patch('/:id', protectAccountOwner, validIfExistOrder, updateOrder);

router.delete('/:id', protectAccountOwner, validIfExistOrder, deleteOrder);

router.post('/purchase', buyMealOnOrder);

module.exports = {
  ordersRouter: router,
};
