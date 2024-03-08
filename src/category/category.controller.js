import Category from './category.model.js';
import { request, response } from 'express';

export const categoryPost = async (req, res) => {
  const { name, description } = req.body;
  const category = new Category({ name, description });

  await category.save();
  res.status(200).json({
    msg: 'The category was added correctly',
    category,
  });
};

export const getCategories = async (_req, res = response) => {
  try {
    const { limit, from } = _req.query;
    const query = { status: true };

    const [total, category] = await Promise.all([
      Category.countDocuments(query),
      Category.find(query).skip(Number(from)).limit(Number(limit)),
    ]);

    res.status(200).json({
      total,
      category,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

export const categoryPut = async (req, res) => {
  const { id } = req.params;
  const { _id, ...rest } = req.body;

  await Category.findByIdAndUpdate(id, rest);

  const category = await Category.findOne({ _id: id });

  res.status(200).json({
    msg: 'The category was updated correctly',
    category,
  });
};

export const categoryDelete = async (req, res) => {
  const { id } = req.params;
  await Category.findByIdAndUpdate(id, { status: false });

  const category = await Category.findOne({ _id: id });

  res.status(200).json({
    msg: 'The category was deleted correctly',
    category,
  });
};
