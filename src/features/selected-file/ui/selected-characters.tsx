import clsx from 'clsx';
import { type FC, useState } from 'react';
import s from './selected-characters.module.css';
import { useCharacterListStore } from '../../character-list/modal/character-list.state.ts';
import { Button, Typography } from '../../../components';
import { CharacterCard } from '../../character-card';
import { createPortal } from 'react-dom';
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

  const setIsOpenHandke = () => {
    setIsOpen((prevState) => !prevState);
  };

  const selectedCharacters = [...selectedCharacterIds.values()];

  return (
    <>
      {createPortal(
        <div
          className={clsx(s.selectedCharacters, isOpen && s.isOpen, className)}
        >
          <div className={s.header} onClick={setIsOpenHandke}>
            <Typography variant={'h2'}>
              Selected characters ( {selectedCharacterIds.size} )
            </Typography>
            <div className={s.controlBtn}>
              <Button variant={'secondary'} onClick={resetCharacterSelected}>
                Reset
              </Button>
              <Button variant={'primary'}>Save</Button>
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
