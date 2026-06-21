import type { FC } from 'react';

import { Skeleton } from '@components/common';
import { CharactersListLoading } from '@components/layout';

const Loading: FC = () => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <Skeleton className="max-h-[38px]" />
      <div className="min-h-0 flex-1">
        <CharactersListLoading />
      </div>
    </div>
  );
};

export default Loading;
