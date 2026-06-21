import type { FC } from 'react';

import { Skeleton } from '@components/common';

const SKELETON_COUNT = 20;
const Loading: FC = () => {
  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden">
      <Skeleton className="max-h-[38px]" />
      <div className="grid grid-cols-2 gap-4 h-full">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <Skeleton key={`skeleton-${index}`} className="max-h-[388px] h-[388px]" />
        ))}
      </div>
    </div>
  );
};

export default Loading;
