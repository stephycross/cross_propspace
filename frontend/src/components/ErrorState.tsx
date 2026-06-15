import { FiAlertTriangle } from "react-icons/fi";
import "./ErrorState.css";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state">
      <span className="error-state-icon">
        <FiAlertTriangle size={30} />
      </span>
      <p className="error-state-message">{message}</p>
      {onRetry ? (
        <button className="btn btn-ghost" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}

export default ErrorState;
