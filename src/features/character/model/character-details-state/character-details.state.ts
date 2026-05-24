import { create } from 'zustand/react';

import {
  type CharacterPreview,
  getCharacterDetails,
} from '@/features/character/api';
import { toCharacterPreview } from '@/features/character/model/toCharacterPreview.ts';

export interface CharacterDetailsState {
  characterDetails: CharacterPreview | null;
  charactersIsLoading: boolean;
  charactersIsError: Error | null;
  fetchCharactersDetails: (params: { characterId: number }) => Promise<void>;
}

export const useCharacterDetailsStore = create<CharacterDetailsState>(
  (set) => ({
    characterDetails: null,
    charactersIsLoading: false,
    charactersIsError: null,

    fetchCharactersDetails: async (params: { characterId: number }) => {
      set({
        characterDetails: null,
        charactersIsLoading: true,
        charactersIsError: null,
      });

      try {
        const response = await getCharacterDetails(params.characterId);
        set({
          characterDetails: toCharacterPreview(response),
          charactersIsLoading: false,
        });
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        set({
          characterDetails: null,
          charactersIsLoading: false,
          charactersIsError: errorObj,
        });
      }
    },
  })
);
