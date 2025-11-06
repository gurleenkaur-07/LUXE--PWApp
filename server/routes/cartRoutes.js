import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // Assuming this is where it is
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

const router = express.Router();

// --- GET THE USER'S CART ---
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // 'req.user' is attached by the 'protect' middleware
    const user = await User.findById(req.user.id).populate(
      'cart.product'
    );
    res.json(user.cart);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// --- ADD AN ITEM TO THE CART ---
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user.id);

    // Check if item is already in the cart
    const existingItem = user.cart.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    // We populate the cart to send it back with full product details
    const updatedUser = await User.findById(req.user.id).populate('cart.product');
    res.json(updatedUser.cart);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;