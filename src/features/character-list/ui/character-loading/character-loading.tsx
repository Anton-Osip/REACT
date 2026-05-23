import { type FC } from 'react';

import clsx from 'clsx';

import { Skeleton } from '@/shared/ui';

import s from './character-loading.module.css';

export type CharacterLoadingProps = {
  className?: string;
  length?: number;
  isLoading: boolean;
};
const SKELETON_COUNT = 20;

export const CharacterLoading: FC<CharacterLoadingProps> = ({
  length = SKELETON_COUNT,
  className,
  isLoading,
}) => {
  if (!isLoading) return null;
  return (
    <div className={clsx(s.characterList, className)}>
      <div className={s.grid}>
        {Array.from({ length: length }).map((_, index) => (
          <Skeleton key={`skeleton-${index}`} />
        ))}
      </div>
    </div>
  );
};
