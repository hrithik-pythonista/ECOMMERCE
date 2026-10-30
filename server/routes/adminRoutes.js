const express = require('express');
const {
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, admin);

router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/users', getAllUsers);
router.get('/stats', getDashboardStats);

module.exports = router;
