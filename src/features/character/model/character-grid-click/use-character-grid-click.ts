import { type MouseEvent, useCallback, useMemo } from 'react';

import { useNavigate } from '@tanstack/react-router';

import type { CharacterPreview } from '@/features/character/api';
import {
  CHARACTER_CARD_FAVORITE_ACTION,
  CHARACTER_CARD_FAVORITE_ACTION_ATTRIBUTE,
  CHARACTER_CARD_ID_ATTRIBUTE,
} from '@/features/character/model/constants.ts';
import { useSelectedCharacterStore } from '@/features/character/model/selected-character-state/selected-character.state.ts';

type UseCharacterGridClickParams = {
  characters: CharacterPreview[] | undefined;
};

export function useCharacterGridClick({
  characters,
}: UseCharacterGridClickParams) {
  const navigate = useNavigate({ from: '/character' });
  const { selectedCharactersMap, toggleCharacterSelected } =
    useSelectedCharacterStore();

  const charactersById = useMemo(
    () => new Map(characters?.map((character) => [character.id, character])),
    [characters]
  );

  const onCharacterGridClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const card = target.closest<HTMLElement>(
        `[${CHARACTER_CARD_ID_ATTRIBUTE}]`
      );
      if (!card?.dataset.cardId) return;

      const cardId = Number(card.dataset.cardId);
      if (!Number.isFinite(cardId)) return;

      const isFavoriteClick = Boolean(
        target.closest(
          `[${CHARACTER_CARD_FAVORITE_ACTION_ATTRIBUTE}="${CHARACTER_CARD_FAVORITE_ACTION}"]`
        )
      );

      if (isFavoriteClick) {
        const character = charactersById.get(cardId);
        if (!character) return;

        toggleCharacterSelected(character);
        return;
      }

      void navigate({
        to: '/character/$id',
        params: { id: String(cardId) },
        search: (prev) => prev,
      });
    },
    [charactersById, navigate, toggleCharacterSelected]
  );

  return { onCharacterGridClick, selectedCharactersMap };
}
