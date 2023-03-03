const { Router } = require('express');
const { check } = require('express-validator');
const {
  updateUser,
  deleteUser,
  getOrdersForUser,
  getOrderByIdForUser,
} = require('../controllers/user.controller');
const {
  protect,
  protectAccountOwner,
} = require('../middlewares/auth.middleware');
const { validIfExistUser } = require('../middlewares/user.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.use(protect); //proteccion de ruta

router.get('/orders', getOrdersForUser);

router.get('/orders/:id', getOrderByIdForUser);

router.patch(
  '/:id',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('email', 'The email must be mandatory').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    validateFields,
    validIfExistUser,
    protectAccountOwner,
  ],
  updateUser
);

router.delete('/:id', validIfExistUser, protectAccountOwner, deleteUser);

module.exports = {
  usersRouter: router,
};
