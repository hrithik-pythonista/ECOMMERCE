import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../utils/api';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Message from '../components/Message';

const CATEGORY_ICONS = {
  Electronics: 'bi-laptop',
  Clothing: 'bi-bag-heart',
  Accessories: 'bi-watch',
  'Home & Kitchen': 'bi-cup-hot',
  'Sports & Outdoors': 'bi-bicycle',
  Books: 'bi-book',
  Toys: 'bi-puzzle',
  'Beauty & Health': 'bi-heart-pulse',
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products', { params: { limit: 8, sort: 'rating' } });
        setFeatured(data.products);
        setCategories(data.categories);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      <section className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 text-white">
              <h1 className="display-4 fw-bold mb-3">Shop Smarter, Live Better</h1>
              <p className="lead mb-4">
                Discover thousands of quality products across electronics, fashion, home
                essentials, and more — all in one place, at prices you'll love.
              </p>
              <Link to="/products" className="btn btn-light btn-lg fw-semibold">
                Shop Now <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
            <div className="col-lg-6 d-none d-lg-block text-center">
              <i className="bi bi-bag-check-fill hero-icon"></i>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <h3 className="fw-bold mb-4">Shop by Category</h3>
        <div className="row g-3">
          {categories.map((cat) => (
            <div className="col-6 col-md-3" key={cat}>
              <Link to={`/products?category=${encodeURIComponent(cat)}`} className="category-card">
                <i className={`bi ${CATEGORY_ICONS[cat] || 'bi-grid'} fs-1 mb-2`}></i>
                <div className="fw-semibold">{cat}</div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0">Top Rated Products</h3>
          <Link to="/products" className="btn btn-outline-primary btn-sm">
            View All
          </Link>
        </div>

        {error && <Message variant="danger">{error}</Message>}

        {loading ? (
          <SkeletonLoader count={8} />
        ) : (
          <div className="row">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-light py-5">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <i className="bi bi-truck fs-1 text-primary mb-3 d-block"></i>
              <h5 className="fw-semibold">Free Shipping</h5>
              <p className="text-muted small">On orders over $100</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-shield-check fs-1 text-primary mb-3 d-block"></i>
              <h5 className="fw-semibold">Secure Payments</h5>
              <p className="text-muted small">100% protected transactions</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-arrow-repeat fs-1 text-primary mb-3 d-block"></i>
              <h5 className="fw-semibold">Easy Returns</h5>
              <p className="text-muted small">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
