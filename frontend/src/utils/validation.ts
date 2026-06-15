// Shared client-side validation. The server validates again; this layer exists
// purely to give fast feedback and avoid pointless network round trips.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | null {
  if (!value.trim()) return "Email is required";
  if (!EMAIL_PATTERN.test(value)) return "Enter a valid email address";
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  return value.trim() ? null : `${label} is required`;
}

export function validatePassword(value: string): string | null {
  if (!value) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters";
  return null;
}

export function validatePrice(value: string): string | null {
  if (!value.trim()) return "Price is required";
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) return "Enter a valid price";
  return null;
}
