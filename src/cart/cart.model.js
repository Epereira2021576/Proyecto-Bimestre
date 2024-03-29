import mongoose from 'mongoose';
import User from '../users/user.model.js';
import Product from '../products/products.model.js';

const CartSchema = new mongoose.Schema({
  cDate: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ['EXISTS', 'PAID'],
    default: 'EXISTS',
    required: true,
  },
});

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;
