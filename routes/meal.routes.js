const { Router } = require('express');
const { check } = require('express-validator');
const {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
} = require('../controllers/meal.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { validIfExistMeal } = require('../middlewares/meal.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', getMeals);

router.get('/:id', validIfExistMeal, getMeal);

router.use(protect);

router.post(
  '/:id',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('price', 'The price must be mandatory').not().isEmpty(),
    check('price', 'The price must be a number').isNumeric(),
    validateFields,
    restrictTo('admin'),
  ],
  createMeal
);

router.patch(
  '/:id',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('price', 'The price must be mandatory').not().isEmpty(),
    check('price', 'The price must be a number').isNumeric(),
    validateFields,
    validIfExistMeal,
    restrictTo('admin'),
  ],
  updateMeal
);

router.delete('/:id', validIfExistMeal, restrictTo('admin'), deleteMeal);

module.exports = {
  mealsRouter: router,
};
