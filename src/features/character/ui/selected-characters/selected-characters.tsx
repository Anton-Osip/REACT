import { type FC } from 'react';

import clsx from 'clsx';

import { Button, Typography } from '@/shared/ui';
import { generateCSV } from '@/shared/utils';

import { useCharacterListStore } from '../../model/character-list-state/character-list.state.ts';
import { CharacterCard } from '../character-card';

import s from './selected-characters.module.css';
interface SelectedCharactersProps {
  className?: string;
}

export const SelectedCharacters: FC<SelectedCharactersProps> = ({
  className,
}) => {
  const { selectedCharacters, resetCharacterSelected } =
    useCharacterListStore();

  const handleDownload = () => {
    if (!selectedCharacters || selectedCharacters.size === 0) return;

    const charactersArray = Array.from(selectedCharacters.values());

    const csvData = generateCSV(charactersArray);

    const fileName = `${selectedCharacters.size}_characters.csv`;

    const blob = new Blob(['\uFEFF' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
            variant={'primary'}
            onClick={handleDownload}
            disabled={selectedCharacters.size === 0}
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
