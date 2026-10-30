const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Customer',
    email: 'john@example.com',
    password: 'customer123',
    role: 'customer',
  },
];

const products = [
  { name: 'Wireless Bluetooth Headphones', description: 'Over-ear noise-cancelling headphones with 30-hour battery life and premium sound quality.', category: 'Electronics', price: 79.99, stock: 45, rating: 4.5, numReviews: 128, brand: 'SoundWave' },
  { name: 'Smartphone Stand & Charger', description: 'Adjustable wireless charging stand compatible with all Qi-enabled smartphones.', category: 'Electronics', price: 29.99, stock: 60, rating: 4.2, numReviews: 84, brand: 'ChargeTech' },
  { name: '4K Ultra HD Smart TV 55"', description: 'Crystal-clear 4K display with built-in streaming apps and voice remote control.', category: 'Electronics', price: 449.99, stock: 15, rating: 4.7, numReviews: 210, brand: 'VisionMax' },
  { name: 'Mechanical Gaming Keyboard', description: 'RGB backlit mechanical keyboard with blue switches for tactile, responsive typing.', category: 'Electronics', price: 59.99, stock: 80, rating: 4.4, numReviews: 156, brand: 'KeyForge' },
  { name: 'Portable Bluetooth Speaker', description: 'Waterproof compact speaker delivering rich bass and 12 hours of playtime.', category: 'Electronics', price: 39.99, stock: 100, rating: 4.3, numReviews: 92, brand: 'SoundWave' },
  { name: "Men's Classic Fit Denim Jacket", description: 'Timeless denim jacket made from durable cotton with a comfortable classic fit.', category: 'Clothing', price: 54.99, stock: 70, rating: 4.1, numReviews: 47, brand: 'UrbanThread' },
  { name: "Women's Running Shoes", description: 'Lightweight breathable running shoes with responsive cushioning for daily training.', category: 'Clothing', price: 74.99, stock: 55, rating: 4.6, numReviews: 189, brand: 'StrideFit' },
  { name: 'Cotton Crew Neck T-Shirt (Pack of 3)', description: '100% soft cotton t-shirts, pre-shrunk and available in multiple colors.', category: 'Clothing', price: 24.99, stock: 150, rating: 4.0, numReviews: 63, brand: 'BasicWear' },
  { name: "Women's Winter Puffer Jacket", description: 'Insulated puffer jacket with water-resistant shell to keep you warm in cold weather.', category: 'Clothing', price: 89.99, stock: 40, rating: 4.5, numReviews: 71, brand: 'PolarEdge' },
  { name: 'Leather Wallet for Men', description: 'Genuine leather bifold wallet with RFID-blocking technology and multiple card slots.', category: 'Accessories', price: 34.99, stock: 90, rating: 4.3, numReviews: 58, brand: 'CraftLeather' },
  { name: 'Stainless Steel Water Bottle', description: 'Insulated 32oz water bottle that keeps drinks cold for 24 hours or hot for 12.', category: 'Home & Kitchen', price: 22.99, stock: 120, rating: 4.6, numReviews: 143, brand: 'HydroFlow' },
  { name: 'Non-Stick Cookware Set (10-Piece)', description: 'Durable non-stick pots and pans set, dishwasher safe and oven safe up to 400°F.', category: 'Home & Kitchen', price: 129.99, stock: 25, rating: 4.4, numReviews: 97, brand: 'ChefCraft' },
  { name: 'Automatic Drip Coffee Maker', description: 'Programmable 12-cup coffee maker with reusable filter and auto shut-off feature.', category: 'Home & Kitchen', price: 49.99, stock: 50, rating: 4.2, numReviews: 76, brand: 'BrewMaster' },
  { name: 'Memory Foam Pillow (2-Pack)', description: 'Ergonomic cervical pillows designed to relieve neck pain and improve sleep posture.', category: 'Home & Kitchen', price: 44.99, stock: 65, rating: 4.5, numReviews: 108, brand: 'ComfortSleep' },
  { name: 'Yoga Mat with Carrying Strap', description: 'Extra-thick non-slip yoga mat suitable for yoga, pilates, and floor exercises.', category: 'Sports & Outdoors', price: 27.99, stock: 85, rating: 4.4, numReviews: 65, brand: 'FlexFit' },
  { name: 'Adjustable Dumbbell Set', description: 'Space-saving adjustable dumbbells ranging from 5 to 25 lbs per hand.', category: 'Sports & Outdoors', price: 149.99, stock: 20, rating: 4.7, numReviews: 132, brand: 'IronCore' },
  { name: '2-Person Camping Tent', description: 'Waterproof lightweight tent with easy setup, perfect for hiking and camping trips.', category: 'Sports & Outdoors', price: 69.99, stock: 35, rating: 4.3, numReviews: 54, brand: 'TrailPro' },
  { name: 'Bestselling Fiction Novel', description: 'A gripping tale of mystery and adventure from a critically acclaimed author.', category: 'Books', price: 14.99, stock: 200, rating: 4.8, numReviews: 312, brand: 'PagePress' },
  { name: 'Kids Educational Building Blocks Set', description: 'Colorful 200-piece building block set that encourages creativity and STEM learning.', category: 'Toys', price: 32.99, stock: 75, rating: 4.6, numReviews: 88, brand: 'BuildJoy' },
  { name: 'Anti-Aging Facial Serum', description: 'Vitamin C serum with hyaluronic acid to brighten skin and reduce fine lines.', category: 'Beauty & Health', price: 19.99, stock: 110, rating: 4.2, numReviews: 175, brand: 'GlowLab' },
];

const importData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    await User.create(users);
    await Product.insertMany(products);

    console.log('✅ Data imported successfully!');
    console.log(`   ${users.length} users created (admin@example.com / admin123)`);
    console.log(`   ${products.length} products created`);
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🗑️  Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
