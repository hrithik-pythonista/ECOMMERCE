const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create new order (checkout)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Validate stock and recompute prices from DB (never trust client prices)
    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
      });

      itemsPrice += product.price * item.quantity;

      // Decrement stock
      product.stock -= item.quantity;
      await product.save();
    }

    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((itemsPrice * 0.08).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    // Clear the user's cart after successful order
    await Cart.deleteMany({ user: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById };
