import { useEffect, type FC, useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';

import { useGetCharacters } from '@/features/character/api';
import { characterQueryKeys } from '@/features/character/api/queries.ts';
import { useCharacterGridClick } from '@/features/character/model/character-grid-click/use-character-grid-click.ts';
import { toCharacterPreview } from '@/features/character/model/toCharacterPreview.ts';
import { Button, Pagination, RefreshIcon } from '@/shared/ui';
import { getQueryErrorMessage } from '@/shared/utils/get-query-error-message.ts';
import { EmptyComponent } from '@/widgets/empty';
import { ErrorComponent } from '@/widgets/error';

import { CharacterListGrid } from '../character-list-grid';
import { CharacterLoading } from '../character-loading';

import s from './character-list.module.css';

type Props = {
  className?: string;
  searchName?: string;
  page: number;
};

export const CharacterList: FC<Props> = ({ className, searchName, page }) => {
  const navigate = useNavigate({ from: '/character' });
  const queryClient = useQueryClient();
  const {
    error,
    isError,
    isLoading,
    isFetching,
    isRefetching,
    data,
    refetch: fetchCharacters,
  } = useGetCharacters({
    name: searchName,
    page,
  });

  const characters = data?.results.map((c) => toCharacterPreview(c));

  const { onCharacterGridClick, selectedCharactersMap } = useCharacterGridClick(
    {
      characters,
    }
  );

  const handleRefresh = () => {
    void queryClient.invalidateQueries({
      queryKey: characterQueryKeys.list({ name: searchName, page }),
    });
  };

  const onPageChange = useCallback(
    (nextPage: number) => {
      void navigate({
        search: (prev) => ({ ...prev, page: nextPage }),
      });
    },
    [navigate]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchName]);

  const charactersIsLoading = isFetching || isLoading || isRefetching;
  const isListEmpty = characters?.length === 0 || characters === undefined;

  if (isError) {
    return (
      <ErrorComponent
        errorText={error ? getQueryErrorMessage(error) : undefined}
        tryAgain={() => void fetchCharacters()}
      />
    );
  }

  if (charactersIsLoading) {
    return <CharacterLoading />;
  }

  if (isListEmpty) {
    return <EmptyComponent />;
  }

  return (
    <div className={clsx(s.characterList, className)}>
      <CharacterListGrid
        characters={characters}
        onCharacterGridClick={onCharacterGridClick}
        selectedCharactersMap={selectedCharactersMap}
      />
      <div className={s.controls}>
        <Pagination
          className={s.pagination}
          pages={data?.info.pages ?? 1}
          currentPage={page}
          onPageChange={onPageChange}
        />

        <Button
          variant={'primary'}
          className={s.refreshDetails}
          onClick={handleRefresh}
          icon={<RefreshIcon size={18} />}
        >
          Refresh characters
        </Button>
      </div>
    </div>
  );
};
