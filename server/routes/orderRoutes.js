import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';

const router = express.Router();

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // --- This is the Stock Management Logic ---
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        if (product.stock < item.quantity) {
          // Not enough stock
          return res
            .status(400)
            .json({ message: `Out of stock for ${product.name}` });
        }
        product.stock -= item.quantity; // Subtract stock
        await product.save();
      } else {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.name}` });
      }
    }
    // --- End of Stock Logic ---

    // Create the new order
    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Bonus: Clear the user's cart after order is successful
    await User.updateOne({ _id: req.user.id }, { $set: { cart: [] } });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;