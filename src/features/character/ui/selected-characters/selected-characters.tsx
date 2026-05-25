import { type FC, useEffect, useMemo } from 'react';

import clsx from 'clsx';

import { useSelectedCharacterStore } from '@/features/character/model/selected-character-state/selected-character.state.ts';
import { Button, Typography } from '@/shared/ui';
import { generateCSV } from '@/shared/utils';

import { CharacterCard } from '../character-card';

import s from './selected-characters.module.css';

interface SelectedCharactersProps {
  className?: string;
}

export const SelectedCharacters: FC<SelectedCharactersProps> = ({
  className,
}) => {
  const { selectedCharacters, resetCharacterSelected } =
    useSelectedCharacterStore();

  const downloadMeta = useMemo(() => {
    if (!selectedCharacters || selectedCharacters.size === 0) return null;

    const csvData = generateCSV(Array.from(selectedCharacters.values()));
    const blob = new Blob(['\uFEFF' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });

    return {
      url: URL.createObjectURL(blob),
      fileName: `${selectedCharacters.size}_characters.csv`,
      blob,
    };
  }, [selectedCharacters]);

  useEffect(() => {
    const url = downloadMeta?.url;
    if (!url) return;

    return () => URL.revokeObjectURL(url);
  }, [downloadMeta?.url]);

  if (!selectedCharacters || selectedCharacters.size === 0) return null;

  const arraySelectedCharacters = [...selectedCharacters.values()];

  return (
    <div className={clsx(s.selectedCharacters, className)}>
      <div className={s.header}>
        <Typography variant={'h2'}>
          Selected characters ( {arraySelectedCharacters.length} )
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
        <div className={s.caruselWrapper}>
          {arraySelectedCharacters.map((character) => (
            <CharacterCard
              className={s.card}
              key={character.id}
              character={character}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
