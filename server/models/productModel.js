import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortDesc: {
      // <-- ADDED THIS
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      // This will be the CURRENT selling price (e.g., $254.99)
      type: Number,
      required: true,
      default: 0,
    },
    originalPrice: {
      // This is the strikethrough price (e.g., $299.99)
      type: Number,
      required: false, // Not all items are on sale
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    imageURL: {
      // Renamed from 'image' to be clearer
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;