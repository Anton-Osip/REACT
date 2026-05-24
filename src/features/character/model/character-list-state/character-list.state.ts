import { create } from 'zustand/react';

import {
  type CharacterPreview,
  type CharactersPreviewResponse,
  getCharacters,
} from '@/features/character/api';

import { toCharacterPreview } from '../toCharacterPreview.ts';

export interface CharacterListState {
  characters: CharactersPreviewResponse | null;
  charactersIsLoading: boolean;
  charactersIsError: Error | null;
  fetchCharacters: (params: { name?: string; page?: number }) => Promise<void>;
  selectedCharacters: Map<number, CharacterPreview> | null;
  toggleCharacterSelected: (character: CharacterPreview) => void;
  resetCharacterSelected: () => void;
}

export const useCharacterListStore = create<CharacterListState>((set) => ({
  characters: null,
  charactersIsLoading: false,
  charactersIsError: null,
  selectedCharacters: null,

  fetchCharacters: async (params: { name?: string; page?: number }) => {
    set({
      characters: null,
      charactersIsLoading: true,
      charactersIsError: null,
    });

    try {
      const response = await getCharacters(params.name, params.page);
      set({
        characters: {
          info: response.info,
          results: response.results.map(toCharacterPreview),
        },
        charactersIsLoading: false,
      });
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error(String(error));
      set({
        characters: null,
        charactersIsLoading: false,
        charactersIsError: errorObj,
      });
    }
  },
  toggleCharacterSelected: (character: CharacterPreview) => {
    set((state) => {
      const next = new Map(state.selectedCharacters ?? undefined);

      if (next.has(character.id)) {
        next.delete(character.id);
      } else {
        next.set(character.id, character);
      }

      return { selectedCharacters: next };
    });
  },

  resetCharacterSelected: () => {
    set({ selectedCharacters: null });
  },
}));
