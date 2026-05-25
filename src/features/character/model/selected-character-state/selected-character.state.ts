import { create } from 'zustand/react';

import { type CharacterPreview } from '@/features/character/api';

export interface SelectedCharacterState {
  selectedCharacters: Map<number, CharacterPreview> | null;
  toggleCharacterSelected: (character: CharacterPreview) => void;
  resetCharacterSelected: () => void;
}

export const useSelectedCharacterStore = create<SelectedCharacterState>(
  (set) => ({
    selectedCharacters: null,

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
  })
);
