import { type FC, useEffect, useMemo } from 'react';

import clsx from 'clsx';

import { useCharacterGridClick } from '@/features/character/model/character-grid-click/use-character-grid-click.ts';
import { useSelectedCharacterStore } from '@/features/character/model/selected-character-state/selected-character.state.ts';
import { Button, Typography } from '@/shared/ui';
import { createCsvDownloadMeta } from '@/shared/utils';

import { CharacterCard } from '../character-card';

import s from './selected-characters.module.css';

interface SelectedCharactersProps {
  className?: string;
}

export const SelectedCharacters: FC<SelectedCharactersProps> = ({
  className,
}) => {
  const { selectedCharactersMap, resetCharacterSelected } =
    useSelectedCharacterStore();

  const selectedCharacters = selectedCharactersMap
    ? [...selectedCharactersMap.values()]
    : [];

  const { onCharacterGridClick } = useCharacterGridClick({
    characters: selectedCharacters,
  });

  const downloadMeta = useMemo(
    () =>
      selectedCharactersMap
        ? createCsvDownloadMeta([...selectedCharactersMap.values()])
        : null,
    [selectedCharactersMap]
  );

  useEffect(() => {
    const url = downloadMeta?.url;
    if (!url) return;

    return () => URL.revokeObjectURL(url);
  }, [downloadMeta?.url]);

  if (!selectedCharactersMap || selectedCharactersMap.size === 0) return null;

  return (
    <div className={clsx(s.selectedCharacters, className)}>
      <div className={s.header}>
        <Typography variant={'h2'}>
          Selected characters ( {selectedCharacters.length} )
        </Typography>
        <div className={s.controlBtn}>
          <Button variant={'secondary'} onClick={resetCharacterSelected}>
            Reset
          </Button>
          <Button
            as="a"
            download={downloadMeta?.fileName}
            href={downloadMeta?.url}
            variant={'primary'}
          >
            Download CSV
          </Button>
        </div>
      </div>

      <div className={s.carusel}>
        <div className={s.caruselWrapper} onClick={onCharacterGridClick}>
          {selectedCharacters.map((character) => (
            <CharacterCard
              className={s.card}
              key={character.id}
              character={character}
              isSelected={selectedCharactersMap?.has(character.id) || false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
