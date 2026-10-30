import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(search.trim() ? `/products?search=${encodeURIComponent(search.trim())}` : '/products');
    setExpanded(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm app-navbar">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/" onClick={() => setExpanded(false)}>
          <i className="bi bi-bag-check-fill me-2"></i>ShopEase
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setExpanded(false)}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products" onClick={() => setExpanded(false)}>
                Products
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin" onClick={() => setExpanded(false)}>
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>

          <form className="d-flex me-lg-3 mb-3 mb-lg-0" onSubmit={handleSearch} role="search">
            <input
              className="form-control form-control-sm me-2"
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search"
            />
            <button className="btn btn-sm btn-light" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          <ul className="navbar-nav align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/cart" onClick={() => setExpanded(false)}>
                <i className="bi bi-cart3 fs-5"></i>
                {cartCount > 0 && (
                  <span className="badge rounded-pill bg-danger cart-badge">{cartCount}</span>
                )}
              </Link>
            </li>

            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {user.name.split(' ')[0]}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile" onClick={() => setExpanded(false)}>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login" onClick={() => setExpanded(false)}>
                  <i className="bi bi-box-arrow-in-right me-1"></i>Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
