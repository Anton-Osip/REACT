import { useEffect, type FC } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';

import { useGetCharacters } from '@/features/character/api';
import { characterQueryKeys } from '@/features/character/api/queries.ts';
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

  const charactersIsLoading = isFetching || isLoading || isRefetching;

  const handleRefresh = () => {
    void queryClient.invalidateQueries({
      queryKey: characterQueryKeys.list({ name: searchName, page }),
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchName]);

  return (
    <>
      <ErrorComponent
        isError={isError}
        errorText={error ? getQueryErrorMessage(error) : undefined}
        tryAgain={() => void fetchCharacters()}
      />

      <EmptyComponent
        isEmpty={characters?.length === 0 && !charactersIsLoading}
      />

      <CharacterLoading isLoading={charactersIsLoading} />

      {characters && !charactersIsLoading && characters.length !== 0 && (
        <div className={clsx(s.characterList, className)}>
          <CharacterListGrid characters={characters} />
          <div className={s.controls}>
            <Pagination
              className={s.pagination}
              pages={data?.info.pages ?? 1}
              currentPage={page}
              onPageChange={(nextPage: number) => {
                void navigate({
                  search: (prev) => ({ ...prev, page: nextPage }),
                });
              }}
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
      )}
    </>
  );
};
