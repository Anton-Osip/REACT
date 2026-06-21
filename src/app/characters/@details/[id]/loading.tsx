import type { FC } from 'react';

import { Skeleton } from '@components/common';

const Loading: FC = () => {
  return <Skeleton className="w-full h-full" />;
};

export default Loading;
