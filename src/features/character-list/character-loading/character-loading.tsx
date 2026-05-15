import { type FC } from 'react';

import s from './character-loading.module.css';
import { Skeleton } from '../../../components';
import clsx from 'clsx';

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
    <div className={clsx(s.grid, className)}>
      {Array.from({ length: length }).map((_, index) => (
        <Skeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
};
