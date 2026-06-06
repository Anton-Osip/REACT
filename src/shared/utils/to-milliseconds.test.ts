import { describe, expect, it } from 'vitest';

import { toMilliseconds } from './to-milliseconds.ts';

describe('toMilliseconds', () => {
  it('returns 0 for empty input', () => {
    expect(toMilliseconds({})).toBe(0);
  });

  it('converts milliseconds', () => {
    expect(toMilliseconds({ milliseconds: 500 })).toBe(500);
  });

  it('converts seconds', () => {
    expect(toMilliseconds({ seconds: 30 })).toBe(30_000);
  });

  it('converts minutes', () => {
    expect(toMilliseconds({ minutes: 5 })).toBe(300_000);
  });

  it('converts hours', () => {
    expect(toMilliseconds({ hours: 2 })).toBe(7_200_000);
  });

  it('converts days', () => {
    expect(toMilliseconds({ days: 1 })).toBe(86_400_000);
  });

  it('sums multiple units', () => {
    expect(
      toMilliseconds({
        days: 1,
        hours: 2,
        minutes: 30,
        seconds: 15,
        milliseconds: 500,
      })
    ).toBe(95_415_500);
  });
});
