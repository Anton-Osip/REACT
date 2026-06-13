import { useState } from 'react';

type useThemeReturn = {
  simulateError: () => void;
};

export const useErrorButton = (): useThemeReturn => {
  const [shouldThrowError, setShouldThrowError] = useState<boolean>(false);

  if (shouldThrowError) {
    throw new Error('Test error from Error Footer - Check console for details');
  }

  const simulateError = (): void => {
    setShouldThrowError(true);
  };

  return { simulateError };
};
