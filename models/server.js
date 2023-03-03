
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const xss = require('xss-clean');

const { db } = require('../database/db');
const { usersRouter } = require('../routes/user.routes');
const { restaurantsRouter } = require('../routes/restaurant.routes');
const { mealsRouter } = require('../routes/meal.routes');
const { ordersRouter } = require('../routes/order.routes');
const AppError = require('../utils/appError');
const globalErrorHandle = require('../controllers/error.controller');
const initModel = require('./initModel');
const { authRouter } = require('../routes/auth.routes');

class Server {
  constructor() {
    this.app = express();

    this.port = process.env.PORT || 6000;

    this.paths = {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      restaurants: '/api/v1/restaurants',
      meals: '/api/v1/meals',
      orders: '/api/v1/orders',
    };

    this.database();

    this.middlewares();

    this.routes();
  }

  //middlewares
  middlewares() {
    this.app.use(helmet());
    this.app.use(xss());
    this.app.use(hpp());

    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
    this.app.use(cors());
    this.app.use(express.json());
  }

  //rutas
  routes() {
    this.app.use(this.paths.auth, authRouter);

    this.app.use(this.paths.users, usersRouter);

    this.app.use(this.paths.restaurants, restaurantsRouter);

    this.app.use(this.paths.meals, mealsRouter);

    this.app.use(this.paths.orders, ordersRouter);

    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
      );
    });

    this.app.use(globalErrorHandle);
  }

  //Database
  database() {
    db.authenticate()
      .then(() => console.log('Database authenticated'))
      .catch(error => console.log(error));

    //relaciones
    initModel();

    db.sync()
      .then(() => console.log('Database synced'))
      .catch(error => console.log(error));
  }

  //listen
  listen() {
    this.app.listen(this.port, () => {
      console.log('Server is running on port', this.port);
    });
  }
}

module.exports = Server;
