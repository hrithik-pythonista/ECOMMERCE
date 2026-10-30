const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get logged in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const cartItems = await Cart.find({ user: req.user._id }).populate(
      'product',
      'name price image stock category'
    );
    res.json(cartItems);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart (or increment quantity if it exists)
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    if (product.stock < qty) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    let cartItem = await Cart.findOne({ user: req.user._id, product: productId });

    if (cartItem) {
      cartItem.quantity += qty;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ user: req.user._id, product: productId, quantity: qty });
    }

    cartItem = await cartItem.populate('product', 'name price image stock category');
    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const cartItem = await Cart.findOne({ _id: req.params.id, user: req.user._id });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(cartItem.product);
    if (product && product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    await cartItem.populate('product', 'name price image stock category');

    res.json(cartItem);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const cartItem = await Cart.findOne({ _id: req.params.id, user: req.user._id });
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    await cartItem.deleteOne();
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart for logged in user
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    await Cart.deleteMany({ user: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
