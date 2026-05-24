import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCharacterDetails, getCharacters } from './getCharacters.ts';

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

    expect(response).toEqual({
      info: {
        count: 0,
        pages: 0,
        next: null,
        prev: null,
      },
      results: [],
    });
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

  it('throws descriptive error for 429 responses', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 429,
    } as Response);

    await expect(getCharacters()).rejects.toThrow(
      "You're sending too many requests too quickly"
    );
  });

  it('uses fallback message when statusText is empty for non-OK responses', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 503,
      statusText: '',
    } as Response);

    await expect(getCharacters()).rejects.toThrow('503: Request failed');
  });

  it('calls API base URL without query params when name and page are omitted', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ info: {}, results: [] }),
    } as Response);

    await getCharacters();

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as URL | string;
    const url = typeof calledUrl === 'string' ? new URL(calledUrl) : calledUrl;

    expect(url.origin + url.pathname).toBe(
      'https://rickandmortyapi.com/api/character'
    );
    expect([...url.searchParams.keys()].length).toBe(0);
  });

  it('wraps network failures in a synthetic error', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('offline'));

    await expect(getCharacters()).rejects.toThrow(/HTTP error!/);
  });
});

describe('getCharacterDetails', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns JSON payload on successful response', async () => {
    const payload = { id: 1, name: 'Rick' };

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => payload,
    } as Response);

    await expect(getCharacterDetails(1)).resolves.toEqual(payload);
    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as URL | string;
    const url = typeof calledUrl === 'string' ? new URL(calledUrl) : calledUrl;
    expect(url.href).toBe('https://rickandmortyapi.com/api/character/1');
  });

  it('throws for 404 responses', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    await expect(getCharacterDetails(999)).rejects.toThrow(
      '404: Bad Request - Invalid search parameters'
    );
  });

  it('throws descriptive error for 400 responses', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
    } as Response);

    await expect(getCharacterDetails(0)).rejects.toThrow(
      '400: Bad Request - Invalid search parameters'
    );
  });

  it('throws descriptive error for 429 responses', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 429,
    } as Response);

    await expect(getCharacterDetails(1)).rejects.toThrow(
      "You're sending too many requests too quickly"
    );
  });

  it('throws descriptive error for 500 responses', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(getCharacterDetails(1)).rejects.toThrow(
      '500: Internal Server Error - Server is having issues'
    );
  });

  it('throws for other non-OK responses', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 418,
      statusText: "I'm a teapot",
    } as Response);

    await expect(getCharacterDetails(1)).rejects.toThrow("418: I'm a teapot");
  });

  it('uses fallback message when statusText is empty for non-OK responses', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 503,
      statusText: '',
    } as Response);

    await expect(getCharacterDetails(1)).rejects.toThrow('503: Request failed');
  });

  it('wraps network failures in a synthetic error', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('offline'));

    await expect(getCharacterDetails(42)).rejects.toThrow(/HTTP error!/);
  });
});
