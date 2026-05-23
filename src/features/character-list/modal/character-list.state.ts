import { create } from 'zustand/react';

import { type CharactersResponse, getCharacters } from '@/api/character';
import type { Character } from '@/api/character/getCharacters.type.ts';

export interface CharacterListState {
  characters: CharactersResponse | null;
  charactersIsLoading: boolean;
  charactersIsError: Error | null;
  fetchCharacters: (params: { name?: string; page?: number }) => Promise<void>;
  selectedCharacterIds: Map<number, Character> | null;
  toggleCharacterSelected: (character: Character) => void;
  resetCharacterSelected: () => void;
}

export const useCharacterListStore = create<CharacterListState>((set) => ({
  characters: null,
  charactersIsLoading: false,
  charactersIsError: null,
  selectedCharacterIds: null,

  fetchCharacters: async (params: { name?: string; page?: number }) => {
    set({
      characters: null,
      charactersIsLoading: true,
      charactersIsError: null,
    });

    try {
      const response = await getCharacters(params.name, params.page);
      set({
        characters: response,
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
  toggleCharacterSelected: (character: Character) => {
    set((state) => {
      const next = new Map(state.selectedCharacterIds ?? undefined);

      if (next.has(character.id)) {
        next.delete(character.id);
      } else {
        next.set(character.id, character);
      }

      return { selectedCharacterIds: next };
    });
  },

  resetCharacterSelected: () => {
    set({ selectedCharacterIds: null });
  },
}));
