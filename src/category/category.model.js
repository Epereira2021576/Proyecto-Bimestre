import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name of the category is required'],
  },
  description: {
    type: String,
    required: [true, 'The description of the category is required'],
  },
  status: { type: Boolean, default: true },
});

export default mongoose.model('Category', CategorySchema);
