const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status || order.status;

    if (req.body.status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    if (req.body.status === 'Cancelled') {
      // restock items on cancellation
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard summary stats (admin)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).select('name stock');

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockProducts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllOrders, updateOrderStatus, getAllUsers, getDashboardStats };
