import type { FC } from 'react';

import { Skeleton } from '@components/common';

const Loading: FC = () => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <Skeleton className="max-h-[38px]" />
      <div className="grid grid-cols-2 gap-4 h-full"></div>
    </div>
  );
};

export default Loading;
