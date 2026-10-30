import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../utils/api';
import Spinner from '../components/Spinner';
import Message from '../components/Message';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Spinner fullPage />;

  if (error) {
    return (
      <div className="container py-5">
        <Message variant="danger">{error}</Message>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
        <h2 className="fw-bold mt-3">Order Placed Successfully!</h2>
        <p className="text-muted">
          Thank you for your purchase. Your order ID is{' '}
          <strong>{order._id.slice(-8).toUpperCase()}</strong>
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Order Items</h5>
              {order.items.map((item, i) => (
                <div key={i} className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div>
                      <div className="fw-semibold">{item.name}</div>
                      <div className="text-muted small">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <span className="fw-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="fw-bold mb-2">Shipping Address</h6>
                  <p className="mb-0 small text-muted">
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zip}<br />
                    {order.shippingAddress.country}<br />
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="fw-bold mb-2">Payment Method</h6>
                  <p className="mb-2 small text-muted">{order.paymentMethod}</p>
                  <h6 className="fw-bold mb-2">Order Status</h6>
                  <span className="badge bg-primary">{order.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link to="/products" className="btn btn-outline-primary me-2">
              Continue Shopping
            </Link>
            <Link to="/profile" className="btn btn-primary">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
