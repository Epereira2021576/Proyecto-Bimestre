'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import UserRoutes from '../src/users/user.routes.js';
import AuthRoutes from '../src/auth/auth.routes.js';
import CategoryRoutes from '../src/category/category.routes.js';
import ProductsRoutes from '../src/products/products.routes.js';
import CartRoutes from '../src/cart/cart.routes.js';
import BillRoutes from '../src/billing/bill.routes.js';

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = '/finalAPI/v1/users';
    this.authPath = '/finalAPI/v1/auth';
    this.categoryPath = '/finalAPI/v1/category';
    this.productPath = '/finalAPI/v1/products';
    this.cartPath = '/finalAPI/v1/cart';
    this.billPath = '/finalAPI/v1/bill';
    // Connect to database
    this.connectDB();
    // Middlewares
    this.middlewares();
    // Routes
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(morgan('dev'));
  }

  routes() {
    this.app.use(this.usersPath, UserRoutes);
    this.app.use(this.authPath, AuthRoutes);
    this.app.use(this.categoryPath, CategoryRoutes);
    this.app.use(this.productPath, ProductsRoutes);
    this.app.use(this.cartPath, CartRoutes);
    this.app.use(this.billPath, BillRoutes);
  }

  // Method to start the server effective
  listen() {
    this.app.listen(this.port, () => {
      console.log('Server running on port', this.port);
    });
  }
}

export default Server;
