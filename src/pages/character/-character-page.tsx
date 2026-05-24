import { type FC } from 'react';

import { Outlet, useMatch } from '@tanstack/react-router';
import clsx from 'clsx';

import {
  CharacterList,
  SearchFormCharacter,
  SelectedCharacters,
} from '@/features/character';
import { Container } from '@/shared/ui';

import { Route } from './route.tsx';

import s from './character-page.module.css';

export const CharacterPage: FC = () => {
  const idMatch = useMatch({ from: '/character/$id', shouldThrow: false });
  const selectCardId = idMatch?.params.id;
  const { search, page } = Route.useSearch();

  return (
    <Container className={s.characterPage}>
      <SearchFormCharacter defaultValue={search} />
      <div
        className={clsx(s.characterContent, selectCardId && s.withSelectedCard)}
      >
        <CharacterList page={page} searchName={search} />
        <Outlet />
      </div>
      <SelectedCharacters />
    </Container>
  );
};
