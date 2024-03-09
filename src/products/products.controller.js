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

export const ordenarProducto = async (req, res = response) => {
  const { ordenReferencia } = req.params;

  let sorting, modo;

  switch (parseInt(ordenReferencia)) {
    case 1:
      sorting = 'name';
      modo = 'asc';
      break;
    case 2:
      sorting = 'name';
      modo = 'desc';
      break;
    case 3:
      sorting = 'price';
      modo = 'asc';
      break;
    case 4:
      sorting = 'price';
      modo = 'desc';
      break;

    case 5:
      sorting = 'category';
      modo = 'asc';
      break;
    default:
      sorting = 'name';
      modo = 'asc';
  }

  const producto = await Producto.find().sort({ [sorting]: modo });
  res.status(200).json({ producto });
};

export const buscarProductoPorCategoria = async (req, res = response) => {
  const { idCategoria } = req.params;
  const producto = await Product.find({ category: idCategoria });
  if (!producto)
    return res
      .status(400)
      .json({ msg: `Did't found any products on this category.` });
  res.status(200).json({ producto });
};
