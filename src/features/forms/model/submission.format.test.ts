import { describe, expect, it } from 'vitest';

import {
  FORM_VARIANT_LABELS,
  formatGender,
  formatSubmittedAt,
} from './submission.format.ts';

describe('FORM_VARIANT_LABELS', () => {
  it('maps form variants to display labels', () => {
    expect(FORM_VARIANT_LABELS.uncontrolled).toBe('Uncontrolled');
    expect(FORM_VARIANT_LABELS.rhf).toBe('React Hook Form');
  });
});

describe('formatGender', () => {
  it('capitalizes the first letter of gender', () => {
    expect(formatGender('male')).toBe('Male');
    expect(formatGender('female')).toBe('Female');
  });
});

describe('formatSubmittedAt', () => {
  it('returns a localized date string for a valid timestamp', () => {
    const timestamp = String(new Date('2024-06-15T12:30:00.000Z').getTime());

    const formatted = formatSubmittedAt(timestamp);

    expect(formatted).not.toBe(timestamp);
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('returns the original value when timestamp is invalid', () => {
    expect(formatSubmittedAt('not-a-date')).toBe('not-a-date');
  });
});
