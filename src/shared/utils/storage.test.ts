import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { loadFromStorage } from './LoadFromStorage.ts';
import { saveToStorage } from './SaveToStorage.ts';

describe('localStorage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns default value when key is missing', () => {
    expect(loadFromStorage('missing-key', 'fallback')).toBe('fallback');
  });

  it('reads JSON-encoded values from storage', () => {
    localStorage.setItem('numbers', JSON.stringify([1, 2, 3]));

    expect(loadFromStorage('numbers', [] as number[])).toEqual([1, 2, 3]);
  });

  it('returns default value when JSON parsing fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('broken', '{not-json');

    expect(loadFromStorage('broken', 'safe')).toBe('safe');

    consoleSpy.mockRestore();
  });

  it('persists values using JSON serialization', () => {
    saveToStorage('term', 'pickle rick');

    expect(JSON.parse(localStorage.getItem('term') ?? '""')).toBe(
      'pickle rick'
    );
  });

  it('logs when saving throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });

    saveToStorage('any', 'value');

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
