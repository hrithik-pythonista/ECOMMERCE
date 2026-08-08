import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please login to add items to your cart');
      navigate('/login');
      return;
    }
    if (product.stock < 1) return;
    await addToCart(product._id, 1);
  };

  return (
    <div className="col-6 col-md-4 col-lg-3 mb-4">
      <div className="card h-100 product-card border-0 shadow-sm">
        <Link to={`/products/${product._id}`}>
          <div className="product-img-wrap">
            <img
              src={product.image}
              alt={product.name}
              className="card-img-top product-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/400x400?text=No+Image';
              }}
            />
          </div>
        </Link>
        <div className="card-body d-flex flex-column">
          <span className="badge bg-light text-dark mb-2 align-self-start">{product.category}</span>
          <Link to={`/products/${product._id}`} className="product-title-link">
            <h6 className="card-title mb-1 product-title">{product.name}</h6>
          </Link>
          <div className="mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <i
                key={i}
                className={`bi ${i < Math.round(product.rating) ? 'bi-star-fill' : 'bi-star'} text-warning small`}
              ></i>
            ))}
            <span className="text-muted small ms-1">({product.numReviews || 0})</span>
          </div>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className="fw-bold fs-5 text-primary">${product.price.toFixed(2)}</span>
            {product.stock < 1 ? (
              <span className="badge bg-secondary">Out of Stock</span>
            ) : (
              <button
                className="btn btn-sm btn-primary"
                onClick={handleAddToCart}
                aria-label={`Add ${product.name} to cart`}
              >
                <i className="bi bi-cart-plus"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
