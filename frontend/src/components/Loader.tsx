import "./Loader.css";

interface LoaderProps {
  label?: string;
}

function Loader({ label = "Loading..." }: LoaderProps) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader-spinner" />
      <span className="loader-label">{label}</span>
    </div>
  );
}

export default Loader;
