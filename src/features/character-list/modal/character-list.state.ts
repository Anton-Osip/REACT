import { type CharactersResponse, getCharacters } from '../../../api/character';
import { create } from 'zustand/react';

export interface CharacterListState {
  characters: CharactersResponse | null;
  charactersIsLoading: boolean;
  charactersIsError: Error | null;
  shouldThrowError: boolean;
  fetchCharacters: (params: { name?: string; page?: number }) => Promise<void>;
  simulateError: () => void;
  resetSimulatedError: () => void;
}

export const useCharacterListStore = create<CharacterListState>((set) => ({
  characters: null,
  charactersIsLoading: false,
  charactersIsError: null,
  shouldThrowError: false,

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
  simulateError: () => {
    set({ shouldThrowError: true });
  },
  resetSimulatedError: () => {
    set({ shouldThrowError: false });
  },
}));
