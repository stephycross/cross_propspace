import { SelectHTMLAttributes } from "react";
import "./InputField.css";

interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string | null;
}

function SelectField({ label, options, error, id, ...rest }: SelectFieldProps) {
  const fieldId = id ?? rest.name;
  return (
    <div className="field">
      <label htmlFor={fieldId} className="field-label">
        {label}
      </label>
      <select
        id={fieldId}
        className={`field-select ${error ? "field-select--error" : ""}`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  );
}

export default SelectField;
