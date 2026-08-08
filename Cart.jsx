import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';
import Message from '../components/Message';

const Cart = () => {
  const { cartItems, loading, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (loading) return <Spinner fullPage />;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-cart3 me-2"></i>Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <Message variant="info">
          Your cart is empty.{' '}
          <Link to="/products" className="alert-link">
            Continue shopping
          </Link>
        </Message>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            {cartItems.map((item) => (
              <div key={item._id} className="card mb-3 border-0 shadow-sm">
                <div className="card-body d-flex flex-column flex-sm-row align-items-sm-center gap-3">
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="cart-item-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/100x100?text=No+Image';
                    }}
                  />
                  <div className="flex-grow-1">
                    <Link
                      to={`/products/${item.product?._id}`}
                      className="fw-semibold text-decoration-none text-dark"
                    >
                      {item.product?.name}
                    </Link>
                    <p className="text-primary fw-bold mb-0">
                      ${item.product?.price?.toFixed(2)}
                    </p>
                  </div>

                  <select
                    className="form-select w-auto"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                  >
                    {Array.from({ length: Math.min(item.product?.stock || 1, 10) }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  <span className="fw-semibold" style={{ minWidth: '80px' }}>
                    ${(item.product?.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeFromCart(item._id)}
                    aria-label="Remove item"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 text-muted small">
                  <span>Shipping & tax calculated at checkout</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
