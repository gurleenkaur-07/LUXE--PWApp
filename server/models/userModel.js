import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true, // No two users can have the same username
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // No two users can have the same email
      lowercase: true, // Stores 'Test@Email.com' as 'test@email.com'
    },
    password: {
      type: String,
      required: true,
      // We'll add password hashing logic here later before saving
    },
    cart: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;