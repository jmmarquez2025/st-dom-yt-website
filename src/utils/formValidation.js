/**
 * Shared form-validation helpers.
 *
 * Contact, Register, and the Mass Intention request form all validate the same
 * email/phone shapes. These were previously referenced (`validateEmail` /
 * `validatePhone`) in Contact.jsx and Register.jsx without ever being defined —
 * a latent ReferenceError that fired on field blur/submit. This module is the
 * single source of truth.
 *
 * Each validator returns "" when the value is acceptable, or the supplied
 * `message` when it is not. Phone is treated as optional (empty ⇒ no error);
 * email validity is checked here, but whether email is *required* is decided by
 * each form (it adds its own "required" message before calling these).
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Accepts 7–10+ digits with common separators: spaces, parens, dots, dashes, +.
export const PHONE_RE =
  /^[\s().\-+]*\d[\s().\-+]*\d[\s().\-+]*\d[\s().\-+]*\d[\s().\-+]*\d[\s().\-+]*\d[\s().\-+]*\d[\s().\-+]*(\d[\s().\-+]*)?(\d[\s().\-+]*)?(\d[\s().\-+]*)?$/;

/** Return `message` when `value` is a non-empty, non-email string; else "". */
export function validateEmail(value, message) {
  const v = (value || "").trim();
  if (!v) return "";
  return EMAIL_RE.test(v) ? "" : message;
}

/** Phone is optional: empty ⇒ "". Otherwise must match PHONE_RE or return `message`. */
export function validatePhone(value, message) {
  const v = (value || "").trim();
  if (!v) return "";
  return PHONE_RE.test(v) ? "" : message;
}
