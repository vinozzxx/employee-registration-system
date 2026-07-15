/**
 * Centralized Validation Rules
 * Shared symmetrically between frontend and backend to guarantee consistency.
 */

// -------------------------------------------------------
// 1. REGEX PATTERNS
// -------------------------------------------------------

/**
 * Validates names.
 * - Minimum 2, Maximum 50 characters.
 * - Supports Unicode letters (e.g., accents, non-Latin characters).
 * - Allows spaces, hyphens, apostrophes, and periods (e.g., "J.R.R.", "José", "O'Connor").
 */
export const NAME_REGEX = /^[\p{L}][\p{L}\p{M}\s'.-]{1,49}$/u;
export const NAME_MESSAGE =
  'Must be 2-50 characters long and can only contain letters, spaces, hyphens, apostrophes, and periods.';

/**
 * Validates last names.
 * - Optional, but if provided, Minimum 1, Maximum 50 characters.
 */
export const LAST_NAME_REGEX = /^[\p{L}][\p{L}\p{M}\s'.-]{0,49}$/u;
export const LAST_NAME_MESSAGE =
  "Last name is optional. If provided, it must be 1–50 characters long and may contain letters, spaces, hyphens (-), apostrophes ('), and periods (.).";

/**
 * Validates Phone Numbers.
 * - Exactly 10 digits.
 */
export const PHONE_REGEX = /^\d{10}$/;
export const PHONE_MESSAGE = 'Phone number must contain exactly 10 digits.';

/**
 * Validates Postal Codes.
 * - Exactly 6 digits.
 */
export const POSTAL_REGEX = /^\d{6}$/;
export const POSTAL_MESSAGE = 'Postal code must contain exactly 6 digits.';

/**
 * Validates City, State, Country.
 * - Letters, spaces, and periods (e.g., "St. Louis").
 */
export const ALPHABETIC_REGEX = /^[\p{L}\p{M}\s.-]+$/u;
export const ALPHABETIC_MESSAGE = 'May only contain letters, spaces, hyphens, and periods.';

// -------------------------------------------------------
// 2. SANITIZATION / SPAM PREVENTION UTILITIES
// -------------------------------------------------------

/**
 * Checks if a string contains known XSS payloads like HTML tags or javascript handlers.
 * Refined to prevent over-restricting valid inputs containing `<` or `>`.
 * Blocks `<script`, `javascript:`, and common inline handlers (`onclick=`).
 */
export const isXssSafe = (input: string): boolean => {
  const xssPattern =
    /<(?:script|iframe|object|embed|svg|math|form|link|meta)\b|javascript:|on[a-z]+\s*=/i;
  return !xssPattern.test(input);
};

/**
 * Validates an address for spam/junk content.
 * - Reject inputs consisting entirely of a single repeated character (e.g. "aaaaa", "11111").
 * - Require at least one alphanumeric character (meaningful words/numbers).
 */
export const isValidAddress = (input: string): boolean => {
  const trimmed = input.trim();
  if (!trimmed) return false;

  // 1. Must contain at least one alphanumeric character (allows numbers or letters from any language)
  if (!/[\p{L}\d]/u.test(trimmed)) return false;

  // 2. Reject if the entire string (ignoring spaces and punctuation) is just one repeated character
  const noSpaces = trimmed.replace(/[\s.,-]/g, '');
  if (/^(.)\1{4,}$/u.test(noSpaces) && new Set(noSpaces).size === 1) return false;

  return true;
};

/**
 * Normalizes multiple consecutive spaces into a single space.
 */
export const normalizeSpaces = (input: string): string => {
  return input.replace(/\s+/g, ' ');
};
