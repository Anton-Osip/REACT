import { describe, expect, it } from 'vitest';

import { getQueryErrorMessage } from './get-query-error-message.ts';

describe('getQueryErrorMessage', () => {
  it('returns message from Error instance', () => {
    expect(getQueryErrorMessage(new Error('Network failed'))).toBe(
      'Network failed'
    );
  });

  it('returns string errors as-is', () => {
    expect(getQueryErrorMessage('plain string failure')).toBe(
      'plain string failure'
    );
  });

  it('returns fallback message for unknown error values', () => {
    expect(getQueryErrorMessage({ code: 500 })).toBe(
      'An unexpected error occurred'
    );
  });
});
