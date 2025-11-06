import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Product from './models/productModel.js';
import Category from './models/categoryModel.js';
import { products } from './data/products.js';
import { categories } from './data/categories.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear old data
    await Product.deleteMany();
    await Category.deleteMany();

    // Insert new data
    await Category.insertMany(categories);
    await Product.insertMany(products);

    console.log('✅ Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();

    console.log('❌ Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// This checks if you ran 'node seeder.js -d'
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}