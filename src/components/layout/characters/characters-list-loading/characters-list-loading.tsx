import type { FC } from 'react';

import { Skeleton } from '@components/common';

const SKELETON_COUNT = 20;

export const CharactersListLoading: FC = () => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <Skeleton key={`skeleton-${index}`} className="h-[388px] max-h-[388px]" />
        ))}
      </div>
      <Skeleton className="h-6 max-w-xs" />
    </div>
  );
};
