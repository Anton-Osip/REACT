import type { FC, MouseEvent } from 'react';

import clsx from 'clsx';

import type { CharacterPreview } from '@/features/character/api';
import { CharacterCard } from '@/features/character/ui/character-card';

import s from './character-list-grid.module.css';

type Props = {
  className?: string;
  characters: CharacterPreview[];
  selectedCharactersMap: Map<number, CharacterPreview> | null;
  onCharacterGridClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export const CharacterListGrid: FC<Props> = ({
  className,
  characters,
  onCharacterGridClick,
  selectedCharactersMap,
}) => {
  if (characters.length === 0) return null;

  return (
    <div className={clsx(s.scroll, className)}>
      <div className={s.grid} onClick={onCharacterGridClick}>
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isSelected={selectedCharactersMap?.has(character.id) || false}
          />
        ))}
      </div>
    </div>
  );
};
