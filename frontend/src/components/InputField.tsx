import { InputHTMLAttributes } from "react";
import "./InputField.css";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

function InputField({ label, error, id, ...rest }: InputFieldProps) {
  const fieldId = id ?? rest.name;
  return (
    <div className="field">
      <label htmlFor={fieldId} className="field-label">
        {label}
      </label>
      <input
        id={fieldId}
        className={`field-input ${error ? "field-input--error" : ""}`}
        {...rest}
      />
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  );
}

export default InputField;
