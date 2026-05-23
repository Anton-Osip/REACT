import type { FC } from 'react';

import { Button } from '@/shared/ui';

import { useSimulateErrorStore } from '../model';

type Props = {
  className?: string;
};

export const SimulateError: FC<Props> = ({ className }) => {
  const { simulateError, shouldThrowError } = useSimulateErrorStore();

  if (shouldThrowError) {
    throw new Error('Test error from Error Footer - Check console for details');
  }

  return (
    <Button variant={'secondary'} className={className} onClick={simulateError}>
      Error Button
    </Button>
  );
};
