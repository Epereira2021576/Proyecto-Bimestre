import mongoose from 'mongoose';
import Category from '../category/category.model.js';
const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nombre obligatorio'],
  },
  price: {
    type: String,
    require: [true, 'El precio del producto es obligatorio'],
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Categoria obligatoria'],
      ref: 'Category',
    },
  ],
  stock: {
    type: String,
    require: [true, 'El stock del producto es obligatorio'],
  },
  status: {
    type: Boolean,
    default: true,
  },
});

ProductSchema.methods.toJSON = function () {
  const { __v, _id, ...product } = this.toObject();
  product.pid = _id;
  return product;
};

export default mongoose.model('Product', ProductSchema);
