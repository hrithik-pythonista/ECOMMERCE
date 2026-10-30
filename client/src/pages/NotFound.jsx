import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5">
      <div className="text-center py-5">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h3 className="fw-bold mb-3">Page Not Found</h3>
        <p className="text-muted mb-4">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <i className="bi bi-house-door me-2"></i>Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
