import Producto from './producto.model.js';
import Category from '../category/category.model.js';
import { request, response } from 'express';

export const productoPost = async (req, res) => {
  const { name, price, category, stock } = req.body;
  const categoryName = await Category.findOne({ name: category });
  const producto = new Producto({
    name,
    price,
    category: categoryName,
    stock,
  });

  await producto.save();
  res.status(200).json({
    msg: 'El producto fue agregado correctamente',
    producto,
  });
};

//Get method
export const getProductos = async (_req, res = response) => {
  try {
    const { limit, from } = _req.query;
    const query = { state: true };

    const [total, producto] = await Promise.all([
      Producto.countDocuments(query),
      Producto.find(query)
        .populate('category')
        .skip(Number(from))
        .limit(Number(limit)),
    ]);

    res.status(200).json({
      total,
      producto,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

export const productoPut = async (req, res) => {
  const { id } = req.params;
  const { _id, ...rest } = req.body;
  await Producto.findByIdAndUpdate(id, rest);

  const producto = await Producto.findOne({ _id: id });
  return res.status(200).json({
    msg: 'El producto fue actualizado correctamente',
    producto,
  });
};

export const productoDelete = async (req, res) => {
  const { id } = req.params;
  await Producto.findByIdAndUpdate(id, { status: false });

  const producto = await Producto.findOne({ _id: id });

  res.status(200).json({
    msg: 'El producto fue eliminado correctamente',
    producto,
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
  const { categoria } = req.params;
  const producto = await Producto.find({ category: categoria });
  if (!producto)
    return res
      .status(400)
      .json({ msg: 'No se encontraron productos de esa categoria' });
  res.status(200).json({ producto });
};
