import mongoose from 'mongoose';
import User from '../users/user.model.js';
import Product from '../products/product.model.js';

const CartSchema = new mongoose.Schema({
  cDate: {
    type: Date,
    required: true,
  },
});
