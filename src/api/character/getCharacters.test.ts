import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCharacters } from './getCharacters';

describe('getCharacters', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns JSON payload on successful response', async () => {
    const payload = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [{ id: 1 }],
    };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => payload,
    } as Response);

    await expect(getCharacters()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalled();
  });

  it('appends name and page query parameters when provided', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ info: {}, results: [] }),
    } as Response);

    await getCharacters('morty', 2);

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as URL | string;
    const url = typeof calledUrl === 'string' ? new URL(calledUrl) : calledUrl;

    expect(url.searchParams.get('name')).toBe('morty');
    expect(url.searchParams.get('page')).toBe('2');
  });

  it('returns empty results when API responds with 404', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    const response = await getCharacters('unknown-character');

    expect(response?.results).toEqual([]);
  });

  it('throws descriptive error for 400 responses', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
    } as Response);

    await expect(getCharacters('bad')).rejects.toThrow(
      '400: Bad Request - Invalid search parameters'
    );
  });

  it('throws descriptive error for 500 responses', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(getCharacters('server')).rejects.toThrow(
      '500: Internal Server Error - Server is having issues'
    );
  });

  it('throws for other non-OK responses', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 418,
      statusText: "I'm a teapot",
    } as Response);

    await expect(getCharacters()).rejects.toThrow("418: I'm a teapot");
  });

  it('wraps network failures in a synthetic error', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('offline'));

    await expect(getCharacters()).rejects.toThrow(/HTTP error!/);
  });
});
