/**
 * Shared form-field validators for the Contact and Register forms.
 *
 * Each validator returns "" when the value is acceptable, or the provided
 * (already-translated) error message when it is not. Empty values pass —
 * required-ness is checked separately by the forms.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 7–10 digits with optional spaces, dots, parens, dashes, and a leading +.
export const PHONE_RE =
  /^[\s().\-+]*\d[\s().\-+]*\d[\s().\-+]*\d[\s().\-+]*\d[\s().\-+]*\d[\s().\-+]*\d[\s().\-+]*\d[\s().\-+]*(\d[\s().\-+]*)?(\d[\s().\-+]*)?(\d[\s().\-+]*)?$/;

export function validateEmail(value, message) {
  const v = (value || "").trim();
  if (!v) return "";
  return EMAIL_RE.test(v) ? "" : message;
}

export function validatePhone(value, message) {
  const v = (value || "").trim();
  if (!v) return "";
  return PHONE_RE.test(v) ? "" : message;
}
