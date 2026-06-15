import { TextareaHTMLAttributes } from "react";
import "./InputField.css";

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string | null;
}

function TextAreaField({ label, error, id, ...rest }: TextAreaFieldProps) {
  const fieldId = id ?? rest.name;
  return (
    <div className="field">
      <label htmlFor={fieldId} className="field-label">
        {label}
      </label>
      <textarea
        id={fieldId}
        rows={5}
        className={`field-textarea ${error ? "field-textarea--error" : ""}`}
        {...rest}
      />
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  );
}

export default TextAreaField;
