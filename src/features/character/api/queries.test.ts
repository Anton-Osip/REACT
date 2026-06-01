import { AxiosError } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/shared/api';

import { characterApi } from './queries.ts';

vi.mock('@/shared/api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(apiClient.get);

describe('characterApi', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAllCharacters', () => {
    it('requests characters without query params by default', async () => {
      const response = {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      };
      mockedGet.mockResolvedValue(response);

      await expect(characterApi.fetchAllCharacters()).resolves.toEqual(
        response
      );
      expect(mockedGet).toHaveBeenCalledWith('/api/character');
    });

    it('passes name and page as query params', async () => {
      mockedGet.mockResolvedValue({
        info: { count: 1, pages: 1, next: null, prev: null },
        results: [],
      });

      await characterApi.fetchAllCharacters({ name: 'rick', page: 2 });

      expect(mockedGet).toHaveBeenCalledWith('/api/character?name=rick&page=2');
    });

    it('returns empty response when API responds with 404', async () => {
      const axiosError = new AxiosError('Not Found');
      axiosError.response = { status: 404 } as AxiosError['response'];
      mockedGet.mockRejectedValue(axiosError);

      await expect(
        characterApi.fetchAllCharacters({ name: 'unknown' })
      ).resolves.toEqual({
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      });
    });

    it('rethrows non-404 axios errors', async () => {
      const axiosError = new AxiosError('Server error');
      axiosError.response = { status: 500 } as AxiosError['response'];
      mockedGet.mockRejectedValue(axiosError);

      await expect(characterApi.fetchAllCharacters()).rejects.toBe(axiosError);
    });
  });

  describe('getCharacterDetails', () => {
    it('requests character by id', async () => {
      const character = { id: 1, name: 'Rick' };
      mockedGet.mockResolvedValue(character);

      await expect(
        characterApi.getCharacterDetails({ characterId: 42 })
      ).resolves.toEqual(character);
      expect(mockedGet).toHaveBeenCalledWith('/api/character/42');
    });
  });
});
