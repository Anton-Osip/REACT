import { type FC, useState } from 'react';

import clsx from 'clsx';
import { createPortal } from 'react-dom';

import { Button, Typography } from '@/shared/ui';
import { generateCSV } from '@/utils';

import { CharacterCard } from '../../character-card';
import { useCharacterListStore } from '../../character-list/modal/character-list.state.ts';

import s from './selected-characters.module.css';
interface SelectedCharactersProps {
  className?: string;
}

export const SelectedCharacters: FC<SelectedCharactersProps> = ({
  className,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const {
    resetCharacterSelected,
    selectedCharacterIds,
    toggleCharacterSelected,
  } = useCharacterListStore();

  if (!selectedCharacterIds || selectedCharacterIds.size === 0) return null;

  const setIsOpenHandle = () => {
    setIsOpen((prevState) => !prevState);
  };

  const selectedCharacters = [...selectedCharacterIds.values()];

  const handleDownload = () => {
    if (selectedCharacterIds.size === 0) return;

    const charactersArray = Array.from(selectedCharacterIds.values());

    const csvData = generateCSV(charactersArray);

    const fileName = `${selectedCharacterIds.size}_characters.csv`;

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

  return (
    <>
      {createPortal(
        <div
          className={clsx(s.selectedCharacters, isOpen && s.isOpen, className)}
        >
          <div className={s.header} onClick={setIsOpenHandle}>
            <Typography variant={'h2'}>
              Selected characters ( {selectedCharacterIds.size} )
            </Typography>
            <div className={s.controlBtn}>
              <Button variant={'secondary'} onClick={resetCharacterSelected}>
                Reset
              </Button>
              <Button
                variant={'primary'}
                onClick={handleDownload}
                disabled={selectedCharacterIds.size === 0}
              >
                Download CSV
              </Button>
            </div>
          </div>

          <div className={s.carusel}>
            <div className={s.caruselWrapper}>
              {selectedCharacters.map((character) => (
                <CharacterCard
                  className={s.card}
                  key={character.id}
                  image={character.image}
                  name={character.name}
                  species={character.species}
                  location={character.location.name}
                  status={character.status}
                  id={character.id}
                  isSelected={selectedCharacterIds.has(character.id)}
                  toggleCharacterSelected={() => {
                    toggleCharacterSelected(character);
                  }}
                />
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
