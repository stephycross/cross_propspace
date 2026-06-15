import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from "../utils/validation";
import InputField from "../components/InputField";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(key: keyof typeof form, value: string): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    const fieldErrors = {
      email: validateEmail(form.email) ?? undefined,
      username: validateRequired(form.username, "Username") ?? undefined,
      password: validatePassword(form.password) ?? undefined,
    };
    setErrors(fieldErrors);
    if (Object.values(fieldErrors).some(Boolean)) {
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      await register(form.email, form.username, form.password);
      navigate("/", { replace: true });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="muted">List, discover, and manage properties in one place.</p>

        {serverError ? <div className="alert alert-error">{serverError}</div> : null}

        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <InputField
            label="Username"
            name="username"
            placeholder="janedoe"
            value={form.username}
            error={errors.username}
            onChange={(e) => update("username", e.target.value)}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            error={errors.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            value={form.password}
            error={errors.password}
            onChange={(e) => update("password", e.target.value)}
          />
          <button className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
