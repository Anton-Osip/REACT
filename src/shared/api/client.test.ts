import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const axiosGetMock = vi.fn();
const axiosCreateMock = vi.fn(() => ({
  get: axiosGetMock,
  interceptors: {
    response: {
      use: vi.fn(),
    },
  },
}));

vi.mock('axios', () => ({
  default: {
    create: axiosCreateMock,
  },
}));

describe('apiClient', () => {
  beforeEach(() => {
    vi.resetModules();
    axiosGetMock.mockReset();
    axiosCreateMock.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('creates axios instance with Rick and Morty API base URL', async () => {
    await import('./client.ts');

    expect(axiosCreateMock).toHaveBeenCalledWith({
      baseURL: 'https://rickandmortyapi.com',
      withCredentials: false,
    });
  });

  it('unwraps axios response data in the response interceptor', async () => {
    await import('./client.ts');

    const instance = axiosCreateMock.mock.results[0]?.value;
    const onFulfilled = instance.interceptors.response.use.mock.calls[0]?.[0];

    expect(onFulfilled({ data: { id: 1 } })).toEqual({ id: 1 });
  });

  it('rejects with the original error in the response interceptor', async () => {
    await import('./client.ts');

    const instance = axiosCreateMock.mock.results[0]?.value;
    const onRejected = instance.interceptors.response.use.mock.calls[0]?.[1];
    const error = new Error('network');

    await expect(onRejected(error)).rejects.toBe(error);
  });

  it('calls axios get with url and optional config', async () => {
    axiosGetMock.mockResolvedValue({ data: { ok: true } });
    const { apiClient } = await import('./client.ts');

    await apiClient.get('/api/character/5', { timeout: 1000 });

    expect(axiosGetMock).toHaveBeenCalledWith('/api/character/5', {
      timeout: 1000,
    });
  });
});
