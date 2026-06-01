import type { FC } from 'react';

import { Button } from '@/shared/ui';

import { useErrorButtonStore } from '../model';

type Props = {
  className?: string;
};

export const ErrorButton: FC<Props> = ({ className }) => {
  const { simulateError, shouldThrowError } = useErrorButtonStore();

  if (shouldThrowError) {
    throw new Error('Test error from Error Footer - Check console for details');
  }

  return (
    <Button variant={'secondary'} className={className} onClick={simulateError}>
      Error Button
    </Button>
  );
};
