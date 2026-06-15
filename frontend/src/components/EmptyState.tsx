import { ReactNode } from "react";
import { FiInbox } from "react-icons/fi";
import "./EmptyState.css";

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: ReactNode;
}

function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">
        <FiInbox size={34} />
      </span>
      <h3 className="empty-state-title">{title}</h3>
      {message ? <p className="empty-state-message">{message}</p> : null}
      {action ? <div className="empty-state-action">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
