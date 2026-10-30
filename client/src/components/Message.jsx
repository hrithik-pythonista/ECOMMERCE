const Message = ({ variant = 'info', children }) => {
  return (
    <div className={`alert alert-${variant} d-flex align-items-center`} role="alert">
      <i className="bi bi-info-circle-fill me-2"></i>
      <div>{children}</div>
    </div>
  );
};

export default Message;
