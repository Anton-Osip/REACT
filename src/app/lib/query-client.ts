import { QueryClient } from '@tanstack/react-query';

import { toMilliseconds } from '@/shared/utils';

const STALE_TIME = toMilliseconds({ minutes: 5 });
const GC_TIME = toMilliseconds({ minutes: 10 });

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
