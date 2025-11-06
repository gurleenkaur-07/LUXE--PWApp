import express from 'express';
import Product from '../models/productModel.js'; 

const router = express.Router();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  // ... (your existing code for all products)
});

// --- ADD THIS NEW ROUTE ---

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // req.params.id gets the ID from the URL
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      // Use 404 for "Not Found"
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    // This catches invalid MongoDB ID formats
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;