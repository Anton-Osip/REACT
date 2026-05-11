import { type FC, useState } from 'react';
import s from './character-page.module.css';
import { SearchForm, STORAGE_KEY } from '../../features/search-form';
import { CharacterList } from '../../features/character-list';
import { loadFromStorage } from '../../utils';

export const CharacterPage: FC = () => {
  const [searchName, setSearchName] = useState<string>(() => {
    return loadFromStorage<string>(STORAGE_KEY, '');
  });

  const searchCharactersByName = (value: string): void => {
    setSearchName(value);
  };

  return (
    <div className={s.characterPage}>
      <SearchForm
        submitInput={searchCharactersByName}
        defaultValue={searchName}
      />
      <CharacterList searchName={searchName} />
    </div>
  );
};
