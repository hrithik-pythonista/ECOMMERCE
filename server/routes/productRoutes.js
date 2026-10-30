const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, upload.single('image'), productValidation, createProduct);
router.put('/:id', protect, admin, upload.single('image'), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
