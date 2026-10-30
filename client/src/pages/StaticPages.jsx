import { useState } from 'react';
import { toast } from 'react-toastify';

export const About = () => (
  <div className="container py-5">
    <h2 className="fw-bold mb-4">About ShopEase</h2>
    <p className="text-muted">
      ShopEase was founded with a simple mission: make online shopping easy, affordable, and
      enjoyable for everyone. We curate a wide range of quality products across electronics,
      fashion, home essentials, sports gear, and more — all backed by fast shipping and
      dependable customer support.
    </p>
    <p className="text-muted">
      Our team works directly with trusted manufacturers and brands to bring you competitive
      prices without compromising on quality. Whether you're upgrading your tech, refreshing
      your wardrobe, or setting up your home, ShopEase is here to help you shop smarter.
    </p>
  </div>
);

export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSent(true);
    toast.success('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Contact Us</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <p className="text-muted">
            Have a question about your order, a product, or anything else? Fill out the form
            and our support team will get back to you within 24 hours.
          </p>
          <p className="mb-1"><i className="bi bi-envelope me-2"></i>support@shopease.com</p>
          <p className="mb-1"><i className="bi bi-telephone me-2"></i>+1 (555) 123-4567</p>
          <p><i className="bi bi-geo-alt me-2"></i>123 Commerce St, Market City, USA</p>
        </div>
        <div className="col-md-6">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                rows="4"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              ></textarea>
              {errors.message && <div className="invalid-feedback">{errors.message}</div>}
            </div>
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const Terms = () => (
  <div className="container py-5">
    <h2 className="fw-bold mb-4">Terms of Service</h2>
    <p className="text-muted">
      By accessing and using ShopEase, you agree to be bound by these Terms of Service. Please
      read them carefully before making a purchase.
    </p>
    <h5 className="fw-semibold mt-4">Orders & Payment</h5>
    <p className="text-muted">
      All orders are subject to product availability. Prices are listed in USD and may change
      without notice. Payment must be completed before an order is processed.
    </p>
    <h5 className="fw-semibold mt-4">Shipping & Returns</h5>
    <p className="text-muted">
      We offer a 30-day return policy on most items. Products must be returned in their original
      condition. Shipping times vary based on location and carrier availability.
    </p>
    <h5 className="fw-semibold mt-4">Account Responsibility</h5>
    <p className="text-muted">
      You are responsible for maintaining the confidentiality of your account credentials and
      for all activities that occur under your account.
    </p>
  </div>
);

export const Privacy = () => (
  <div className="container py-5">
    <h2 className="fw-bold mb-4">Privacy Policy</h2>
    <p className="text-muted">
      We value your privacy. This policy explains how we collect, use, and protect your personal
      information when you use ShopEase.
    </p>
    <h5 className="fw-semibold mt-4">Information We Collect</h5>
    <p className="text-muted">
      We collect information you provide directly, such as your name, email, shipping address,
      and payment details, in order to process orders and improve your shopping experience.
    </p>
    <h5 className="fw-semibold mt-4">How We Use Your Data</h5>
    <p className="text-muted">
      Your data is used to fulfill orders, provide customer support, and send order-related
      communications. We do not sell your personal information to third parties.
    </p>
    <h5 className="fw-semibold mt-4">Data Security</h5>
    <p className="text-muted">
      We use industry-standard encryption and security practices, including hashed passwords and
      secure token-based authentication, to protect your account information.
    </p>
  </div>
);
