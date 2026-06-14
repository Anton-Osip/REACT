import { FC } from 'react';

import { CharactersCard } from '@components/layout/characters/characters-card';
import { CharacterPreview } from '@services/character';

type Props = {
  characters: CharacterPreview[];
};
const COUNT_PRIORITY_IMAGES = 4;

export const CharactersList: FC<Props> = ({ characters }) => {
  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <div className="grid grid-cols-4 gap-4">
        {characters.map((character, index) => (
          <CharactersCard character={character} key={character.id} priority={index < COUNT_PRIORITY_IMAGES} />
        ))}
      </div>
    </div>
  );
};
