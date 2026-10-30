import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { getErrorMessage } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Message from '../components/Message';

const statusColors = {
  Pending: 'secondary',
  Processing: 'info',
  Shipped: 'primary',
  Delivered: 'success',
  Cancelled: 'danger',
};

const Profile = () => {
  const { user, updateUserInfo } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        setOrdersError(getErrorMessage(err));
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (form.password && form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
      };
      if (form.password) payload.password = form.password;

      const { data } = await api.put('/auth/profile', payload);
      updateUserInfo(data);
      setForm({ ...form, password: '' });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-person-circle me-2"></i>My Profile
      </h2>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Account Details</h5>
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" value={user?.email || ''} disabled />
                  <div className="form-text">Email cannot be changed</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <hr />
                <h6 className="fw-semibold mb-3">Shipping Address</h6>

                <div className="row g-2 mb-3">
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Street"
                      value={form.street}
                      onChange={(e) => setForm({ ...form, street: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="City"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="State"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ZIP Code"
                      value={form.zip}
                      onChange={(e) => setForm({ ...form, zip: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Country"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                    />
                  </div>
                </div>

                <hr />

                <div className="mb-3">
                  <label className="form-label">New Password (optional)</label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Leave blank to keep current password"
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={saving}>
                  {saving && <span className="spinner-border spinner-border-sm me-2"></span>}
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">My Orders</h5>

              {ordersLoading ? (
                <Spinner />
              ) : ordersError ? (
                <Message variant="danger">{ordersError}</Message>
              ) : orders.length === 0 ? (
                <Message variant="info">
                  You haven't placed any orders yet.{' '}
                  <Link to="/products" className="alert-link">
                    Start shopping
                  </Link>
                </Message>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td className="small">{order._id.slice(-8).toUpperCase()}</td>
                          <td className="small">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="fw-semibold">${order.totalPrice.toFixed(2)}</td>
                          <td>
                            <span className={`badge bg-${statusColors[order.status] || 'secondary'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
