import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer text-light mt-auto pt-5 pb-3">
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-bag-check-fill me-2"></i>ShopEase
            </h5>
            <p className="text-secondary small">
              Your one-stop destination for quality products at unbeatable prices. Shop
              smart, shop easy.
            </p>
          </div>

          <div className="col-md-2 col-6">
            <h6 className="fw-semibold mb-3">Company</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="col-md-2 col-6">
            <h6 className="fw-semibold mb-3">Legal</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/terms">Terms</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="fw-semibold mb-3">Get In Touch</h6>
            <p className="text-secondary small mb-1">
              <i className="bi bi-envelope me-2"></i>support@shopease.com
            </p>
            <p className="text-secondary small">
              <i className="bi bi-telephone me-2"></i>+1 (555) 123-4567
            </p>
          </div>
        </div>

        <hr className="border-secondary mt-4" />

        <p className="text-center text-secondary small mb-0">
          &copy; {year} ShopEase. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
