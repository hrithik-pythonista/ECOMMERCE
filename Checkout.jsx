import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { getErrorMessage } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Message from '../components/Message';

const Checkout = () => {
  const { cartItems, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const shippingPrice = cartTotal > 100 ? 0 : 10;
  const taxPrice = Number((cartTotal * 0.08).toFixed(2));
  const totalPrice = Number((cartTotal + shippingPrice + taxPrice).toFixed(2));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = 'This field is required';
      }
    });
    if (form.phone && !/^[\d+\-\s()]{7,20}$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      const items = cartItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      const { data } = await api.post('/orders', {
        items,
        shippingAddress: form,
        paymentMethod,
      });

      toast.success('Order placed successfully!');
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <Message variant="info">
          Your cart is empty.{' '}
          <Link to="/products" className="alert-link">
            Add some products first
          </Link>
        </Message>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Checkout</h2>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Shipping Address</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                      value={form.fullName}
                      onChange={handleChange}
                    />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      value={form.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      className={`form-control ${errors.street ? 'is-invalid' : ''}`}
                      value={form.street}
                      onChange={handleChange}
                    />
                    {errors.street && <div className="invalid-feedback">{errors.street}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      value={form.city}
                      onChange={handleChange}
                    />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                      value={form.state}
                      onChange={handleChange}
                    />
                    {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">ZIP Code</label>
                    <input
                      type="text"
                      name="zip"
                      className={`form-control ${errors.zip ? 'is-invalid' : ''}`}
                      value={form.zip}
                      onChange={handleChange}
                    />
                    {errors.zip && <div className="invalid-feedback">{errors.zip}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      name="country"
                      className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                      value={form.country}
                      onChange={handleChange}
                    />
                    {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Payment Method</h5>
                {['COD', 'Card', 'PayPal', 'UPI'].map((method) => (
                  <div className="form-check mb-2" key={method}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id={method}
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor={method}>
                      {method === 'COD' ? 'Cash on Delivery' : method}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Order Summary</h5>
                {cartItems.map((item) => (
                  <div key={item._id} className="d-flex justify-content-between small mb-2">
                    <span>
                      {item.product.name} x{item.quantity}
                    </span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                  {submitting ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="bi bi-check-circle me-2"></i>
                  )}
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
