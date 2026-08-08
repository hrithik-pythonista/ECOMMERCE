import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { getErrorMessage } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';
import Message from '../components/Message';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setQuantity(1);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to your cart');
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, quantity);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Spinner fullPage />;

  if (error) {
    return (
      <div className="container py-5">
        <Message variant="danger">{error}</Message>
        <Link to="/products" className="btn btn-primary mt-2">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      <div className="row g-5">
        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded shadow-sm product-detail-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/500x500?text=No+Image';
            }}
          />
        </div>

        <div className="col-md-6">
          <span className="badge bg-light text-dark mb-2">{product.category}</span>
          <h2 className="fw-bold">{product.name}</h2>

          <div className="mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <i
                key={i}
                className={`bi ${i < Math.round(product.rating) ? 'bi-star-fill' : 'bi-star'} text-warning`}
              ></i>
            ))}
            <span className="text-muted ms-2">({product.numReviews || 0} reviews)</span>
          </div>

          <h3 className="text-primary fw-bold mb-3">${product.price.toFixed(2)}</h3>

          <p className="text-muted">{product.description}</p>

          {product.brand && (
            <p className="mb-1">
              <strong>Brand:</strong> {product.brand}
            </p>
          )}

          <p className="mb-3">
            <strong>Availability:</strong>{' '}
            {product.stock > 0 ? (
              <span className="text-success">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-danger">Out of Stock</span>
            )}
          </p>

          {product.stock > 0 && (
            <div className="d-flex align-items-center gap-3 mb-4">
              <label htmlFor="qty" className="fw-semibold mb-0">
                Quantity:
              </label>
              <select
                id="qty"
                className="form-select w-auto"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {Array.from({ length: Math.min(product.stock, 10) }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            className="btn btn-primary btn-lg"
            disabled={product.stock < 1 || adding}
            onClick={handleAddToCart}
          >
            {adding ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              <i className="bi bi-cart-plus me-2"></i>
            )}
            {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
