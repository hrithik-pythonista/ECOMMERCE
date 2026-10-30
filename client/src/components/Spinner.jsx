const Spinner = ({ fullPage = false, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';

  const spinner = (
    <div className="d-flex justify-content-center align-items-center py-4">
      <div className={`spinner-border text-primary ${sizeClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '60vh' }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;
