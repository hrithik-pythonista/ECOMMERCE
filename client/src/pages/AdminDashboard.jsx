import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api, { getErrorMessage } from '../utils/api';
import Spinner from '../components/Spinner';
import Message from '../components/Message';

const statusColors = {
  Pending: 'secondary',
  Processing: 'info',
  Shipped: 'primary',
  Delivered: 'success',
  Cancelled: 'danger',
};

const emptyProductForm = {
  name: '',
  description: '',
  category: '',
  price: '',
  stock: '',
  brand: '',
};

const AdminDashboard = () => {
  const [tab, setTab] = useState('stats');

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-speedometer2 me-2"></i>Admin Dashboard
      </h2>

      <ul className="nav nav-tabs mb-4">
        {['stats', 'products', 'orders', 'users'].map((t) => (
          <li className="nav-item" key={t}>
            <button
              className={`nav-link ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {tab === 'stats' && <StatsTab />}
      {tab === 'products' && <ProductsTab />}
      {tab === 'orders' && <OrdersTab />}
      {tab === 'users' && <UsersTab />}
    </div>
  );
};

const StatsTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Message variant="danger">{error}</Message>;

  const cards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: 'bi-currency-dollar', color: 'success' },
    { label: 'Total Orders', value: stats.totalOrders, icon: 'bi-bag-check', color: 'primary' },
    { label: 'Total Products', value: stats.totalProducts, icon: 'bi-box-seam', color: 'info' },
    { label: 'Total Users', value: stats.totalUsers, icon: 'bi-people', color: 'warning' },
  ];

  return (
    <div>
      <div className="row g-3 mb-4">
        {cards.map((c) => (
          <div className="col-6 col-md-3" key={c.label}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <i className={`bi ${c.icon} text-${c.color} fs-1 mb-2 d-block`}></i>
                <h4 className="fw-bold mb-0">{c.value}</h4>
                <p className="text-muted small mb-0">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.lowStockProducts.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h6 className="fw-bold mb-3">
              <i className="bi bi-exclamation-triangle text-warning me-2"></i>Low Stock Alert
            </h6>
            <ul className="list-group list-group-flush">
              {stats.lowStockProducts.map((p) => (
                <li key={p._id} className="list-group-item d-flex justify-content-between px-0">
                  <span>{p.name}</span>
                  <span className="badge bg-danger">{p.stock} left</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProductForm);
  const [imageFile, setImageFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products', { params: { limit: 100 } });
      setProducts(data.products);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resetForm = () => {
    setForm(emptyProductForm);
    setImageFile(null);
    setEditingId(null);
    setFormErrors({});
    setShowForm(false);
  };

  const startEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      brand: product.brand || '',
    });
    setEditingId(product._id);
    setImageFile(null);
    setShowForm(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.category.trim()) errs.category = 'Category is required';
    if (form.price === '' || Number(form.price) < 0) errs.price = 'Enter a valid price';
    if (form.stock === '' || Number(form.stock) < 0) errs.stock = 'Enter a valid stock quantity';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (imageFile) formData.append('image', imageFile);

      if (editingId) {
        await api.put(`/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product created successfully');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Manage Products</h5>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
        >
          <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'} me-1`}></i>
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-bold mb-3">{editingId ? 'Edit Product' : 'New Product'}</h6>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.category ? 'is-invalid' : ''}`}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                  {formErrors.category && <div className="invalid-feedback">{formErrors.category}</div>}
                </div>
                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  ></textarea>
                  {formErrors.description && (
                    <div className="invalid-feedback">{formErrors.description}</div>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className={`form-control ${formErrors.price ? 'is-invalid' : ''}`}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                  {formErrors.price && <div className="invalid-feedback">{formErrors.price}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className={`form-control ${formErrors.stock ? 'is-invalid' : ''}`}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                  {formErrors.stock && <div className="invalid-feedback">{formErrors.stock}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                  <div className="form-text">
                    {editingId ? 'Leave empty to keep current image' : 'Optional — a placeholder will be used if omitted'}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-3" disabled={saving}>
                {saving && <span className="spinner-border spinner-border-sm me-2"></span>}
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/45x45?text=NA';
                      }}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>
                    {p.stock <= 5 ? (
                      <span className="badge bg-danger">{p.stock}</span>
                    ) : (
                      p.stock
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => startEdit(p)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
      toast.success('Order status updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <Spinner />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (orders.length === 0) return <Message variant="info">No orders yet.</Message>;

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td className="small">{o._id.slice(-8).toUpperCase()}</td>
              <td>{o.user?.name || 'Unknown'}</td>
              <td className="small">{new Date(o.createdAt).toLocaleDateString()}</td>
              <td className="fw-semibold">${o.totalPrice.toFixed(2)}</td>
              <td>
                <select
                  className={`form-select form-select-sm border-${statusColors[o.status]}`}
                  value={o.status}
                  onChange={(e) => handleStatusChange(o._id, e.target.value)}
                >
                  {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users');
        setUsers(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <span className={`badge bg-${u.role === 'admin' ? 'danger' : 'secondary'}`}>
                  {u.role}
                </span>
              </td>
              <td className="small">{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
