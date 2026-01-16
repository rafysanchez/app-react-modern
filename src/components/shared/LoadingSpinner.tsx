import './LoadingSpinner.css';

type LoadingSpinnerProps = {
  label?: string;
  size?: number;
};

const LoadingSpinner = ({ label = 'Loading...', size = 56 }: LoadingSpinnerProps) => {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <img src="/spinner.svg" alt={label} style={{ width: size, height: size }} />
      {label && <span className="loading-text">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
