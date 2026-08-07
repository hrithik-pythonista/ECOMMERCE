# MERN E-Commerce Store (ShopEase)

A complete, production-ready full-stack e-commerce web application built with MongoDB,
Express.js, React (Vite), and Node.js.

## Features

**Customer**
- Register / Login / Logout (JWT authentication)
- Browse products with search, category filter, sorting, and pagination
- Product detail pages with stock and rating display
- Add to cart, update quantity, remove from cart
- Checkout with shipping address & payment method selection
- Order confirmation page and order history in profile
- Responsive, mobile-friendly Bootstrap 5 UI with toast notifications and skeleton loaders

**Admin**
- Admin dashboard with revenue/order/product/user stats and low-stock alerts
- Full product CRUD with image upload
- Order management (update order status)
- User management (view all registered users)

## Tech Stack

- **Frontend:** React 18 (Vite), React Router DOM, Axios, Bootstrap 5, Bootstrap Icons, React Toastify
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** JWT, bcrypt.js
- **File Uploads:** Multer
- **Validation:** express-validator (backend), custom React validation (frontend)

## Folder Structure

```
ecommerce/
│
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Navbar, Footer, ProductCard, Spinner, etc.
│   │   ├── context/        # AuthContext, CartContext
│   │   ├── pages/          # Home, Products, Cart, Checkout, Admin, etc.
│   │   ├── utils/api.js    # Axios instance
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── config/db.js
│   ├── models/             # User, Product, Cart, Order
│   ├── controllers/
│   ├── routes/
│   ├── middleware/         # auth, error handling, upload
│   ├── uploads/             # uploaded product images
│   ├── seed.js              # database seeder (20 sample products)
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Prerequisites

- Node.js v18+ and npm
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

## Installation & Setup

### 1. Clone / extract the project

```bash
cd ecommerce
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` with your values:

```
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=change_this_to_a_long_random_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

Seed the database with 20 sample products and demo users:

```bash
npm run seed
```

This creates:
- Admin: `admin@example.com` / `admin123`
- Customer: `john@example.com` / `customer123`

Start the backend server (with auto-reload via nodemon):

```bash
npm run server
```

The API will run at `http://localhost:5000`.

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The app will run at `http://localhost:5173` and proxies `/api` requests to the backend automatically (see `vite.config.js`).

### 4. Open the app

Visit `http://localhost:5173` in your browser. Login with the demo admin account to access `/admin`.

## Environment Variables

### Server (`server/.env`)
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `PORT` | Port the Express server runs on (default 5000) |
| `CLIENT_URL` | Frontend URL, used for CORS |

### Client (`client/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base API URL (default `/api`, proxied to backend in dev) |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/auth/profile` — Get logged-in user profile (protected)
- `PUT /api/auth/profile` — Update profile (protected)

### Products
- `GET /api/products` — List products (search, category, sort, pagination via query params)
- `GET /api/products/:id` — Get single product
- `POST /api/products` — Create product (admin only, multipart/form-data with `image`)
- `PUT /api/products/:id` — Update product (admin only)
- `DELETE /api/products/:id` — Delete product (admin only)

### Cart (all protected)
- `GET /api/cart` — Get current user's cart
- `POST /api/cart` — Add item to cart
- `PUT /api/cart/:id` — Update cart item quantity
- `DELETE /api/cart/:id` — Remove item from cart
- `DELETE /api/cart` — Clear cart

### Orders (all protected)
- `POST /api/orders` — Place a new order (checkout)
- `GET /api/orders` — Get logged-in user's orders
- `GET /api/orders/:id` — Get single order by ID

### Admin (all protected + admin only)
- `GET /api/admin/orders` — Get all orders
- `PUT /api/admin/orders/:id` — Update order status
- `GET /api/admin/users` — Get all users
- `GET /api/admin/stats` — Dashboard summary stats

## Production Build

Build the frontend for production:

```bash
cd client
npm run build
```

This outputs static files to `client/dist`, which can be served by any static host or by
Express itself (e.g., using `express.static`).

Run the backend in production:

```bash
cd server
npm start
```

## Notes

- Passwords are hashed with bcrypt before being stored.
- JWT tokens expire after 30 days.
- Product prices are always recalculated server-side at checkout — client-submitted prices are
  never trusted.
- Stock is validated and decremented atomically during checkout, and restored automatically if
  an admin cancels an order.
- Uploaded product images are stored in `server/uploads` and served statically at `/uploads`.

## License

This project is provided as-is for educational and portfolio purposes.
