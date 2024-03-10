import Product from './products.model.js';
import Category from '../category/category.model.js';
import { request, response } from 'express';

export const productoPost = async (req, res) => {
  const { name, price, category, stock } = req.body;
  const categoryName = await Category.findOne({ name: category });
  const productNew = new Product({
    name,
    price,
    category: categoryName,
    stock,
  });

  await productNew.save();
  res.status(200).json({
    msg: 'Succesfully added product',
    productNew,
  });
};

//Get method
export const getProductos = async (_req, res = response) => {
  try {
    const { limit, from } = _req.query;
    const query = { status: true };

    const [total, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate('category')
        .skip(Number(from))
        .limit(Number(limit)),
    ]);

    res.status(200).json({
      total,
      products,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

//get products by name
export const searchProducts = async (req, res) => {
  const { prodName } = req.params;
  const productName = await Product.findOne({ name: prodName });
  if (!productName) {
    res
      .status(400)
      .json({ msg: 'No product under that name exists in the database' });
  } else {
    res.status(200).json({ msg: 'Product Found!', productName });
  }
};

export const productoPut = async (req, res) => {
  const { id } = req.params;
  const { _id, ...rest } = req.body;
  const categoryName = await Category.findOne({ name: rest.category });
  rest.category = categoryName;
  await Product.findByIdAndUpdate(id, rest);

  const product = await Product.findOne({ _id: id });
  return res.status(200).json({
    msg: 'Product Updated Succesfully',
    product,
  });
};

export const productoDelete = async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndUpdate(id, { status: false });

  const product = await Producto.findOne({ _id: id });

  res.status(200).json({
    msg: 'Product deleted succesfully',
    product,
  });
};

export const categoryProducts = async (req, res = response) => {
  const { nameCat } = req.params;
  const catFind = await Category.findOne({ name: nameCat });
  const products = await Product.find({ category: catFind });
  if (!products)
    return res
      .status(400)
      .json({ msg: `Did't found any products on this category.` });
  res
    .status(200)
    .json({ msg: `Category Filtered:  ${catFind.name}`, products });
};
