//Importacion
const { Router } = require('express');
const { check } = require('express-validator');
const { signup, login } = require('../controllers/auth.controller');
const { validIfExistUserEmail } = require('../middlewares/user.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

//Creacion de usuario
router.post(
  '/signup',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('email', 'The email must be mandatory').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password must be mandatory').not().isEmpty(),
    validateFields,
    validIfExistUserEmail,
  ],
  signup
);

//Login

router.post(
  '/login',
  [
    check('email', 'The email must be mandatory').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password must be mandatory').not().isEmpty(),
    validateFields,
  ],
  login
);

module.exports = {
  authRouter: router,
};
