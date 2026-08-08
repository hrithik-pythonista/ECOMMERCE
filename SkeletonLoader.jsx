export const ProductCardSkeleton = () => (
  <div className="col-6 col-md-4 col-lg-3 mb-4">
    <div className="card h-100 border-0 shadow-sm skeleton-card">
      <div className="skeleton-shimmer" style={{ height: '200px' }}></div>
      <div className="card-body">
        <div className="skeleton-shimmer mb-2" style={{ height: '18px', width: '80%' }}></div>
        <div className="skeleton-shimmer mb-2" style={{ height: '14px', width: '50%' }}></div>
        <div className="skeleton-shimmer" style={{ height: '20px', width: '40%' }}></div>
      </div>
    </div>
  </div>
);

const SkeletonLoader = ({ count = 8 }) => {
  return (
    <div className="row">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
