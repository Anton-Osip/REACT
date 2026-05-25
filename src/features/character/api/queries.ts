import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

import type {
  CharacterResponse,
  CharactersResponse,
} from '@/features/character/api/getCharacters.type.ts';
import { apiClient } from '@/shared/api';

const EMPTY_CHARACTERS_RESPONSE: CharactersResponse = {
  info: {
    count: 0,
    pages: 0,
    next: null,
    prev: null,
  },
  results: [],
};

export const characterApi = {
  fetchAllCharacters: async (params?: { name?: string; page?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.name) searchParams.set('name', params.name);
    if (params?.page != null) searchParams.set('page', String(params.page));

    const url = `/api/character${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    try {
      return await apiClient.get<CharactersResponse>(url);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return EMPTY_CHARACTERS_RESPONSE;
      }
      throw error;
    }
  },

  getCharacterDetails: (params: { characterId: number }) => {
    const url = `/api/character/${params.characterId}`;

    return apiClient.get<CharacterResponse>(url);
  },
};

export const useGetCharacters = (params?: { name?: string; page?: number }) => {
  return useQuery<CharactersResponse>({
    queryKey: ['characters', params?.name ?? '', params?.page ?? 1],
    queryFn: () => characterApi.fetchAllCharacters(params),
    retry: false,
    staleTime: 1000 * 60 * 10,
    placeholderData: (previousData) => previousData,
  });
};

export const useGetCharactersDetails = (params: { characterId: number }) => {
  return useQuery<CharacterResponse>({
    queryKey: ['characterDetails', params?.characterId ?? ''],
    queryFn: () => characterApi.getCharacterDetails(params),
    retry: false,
    staleTime: 1000 * 60 * 10,
    placeholderData: (previousData) => previousData,
  });
};
