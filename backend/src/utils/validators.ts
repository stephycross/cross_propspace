// Lightweight pure validators reused by the service layer. Keeping them here
// avoids pulling a heavy validation dependency for a handful of checks.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_PATTERN.test(value.trim());
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isStrongEnoughPassword(value: unknown): value is string {
  return typeof value === "string" && value.length >= 6;
}

export function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}
