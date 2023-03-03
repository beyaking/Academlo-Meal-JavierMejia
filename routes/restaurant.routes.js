const { Router } = require('express');
const { check } = require('express-validator');
const {
  createNewRestaurat,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurat,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/restaurant.controller');
const {
  restrictTo,
  protect,
  protectAccountOwner,
} = require('../middlewares/auth.middleware');
const {
  validIfExistRestaurant,
  validIfRestaurantId,
} = require('../middlewares/restaurant.middleware');
const { validIfExistReview } = require('../middlewares/review.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', getRestaurants);

router.get('/:id', validIfExistRestaurant, getRestaurant);

router.use(protect);

router.post(
  '/',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('address', 'The address must be mandatory').not().isEmpty(),
    check('rating', 'The rating must be mandatory').not().isEmpty(),
    check('rating', 'The rating must be a number').isNumeric(),
    validateFields,
  ],
  restrictTo('admin'),
  createNewRestaurat
);

router.patch(
  '/:id',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('address', 'The address must be mandatory').not().isEmpty(),
    validateFields,
  ],
  validIfExistRestaurant,
  restrictTo('admin'),
  updateRestaurant
);

router.delete(
  '/:id',
  validIfExistRestaurant,
  restrictTo('admin'),
  deleteRestaurat
);

router.post(
  '/reviews/:id',
  [
    check('comment', 'Your comment is required').not().isEmpty(),
    check('rating', 'The rating is required').not().isEmpty(),
    check('rating', 'The rating must be numeric').isNumeric(),
    validateFields,
    validIfExistRestaurant,
  ],
  createReview
);

router.patch(
  '/reviews/:restaurantId/:id',
  [
    check('comment', 'Your comment is required').not().isEmpty(),
    check('rating', 'The rating is required').not().isEmpty(),
    check('rating', 'The rating must be numeric').isNumeric(),
    validateFields,
    protectAccountOwner,
  ],
  validIfExistReview,
  validIfRestaurantId,
  updateReview
);

router.delete(
  '/reviews/:restaurantId/:id',
  validIfExistReview,
  validIfExistRestaurant,
  protectAccountOwner,
  deleteReview
);

module.exports = {
  restaurantsRouter: router,
};
