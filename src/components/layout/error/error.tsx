import { type FC } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { withBasePath } from '@/utils';
import { Button, Typography } from '@components/common';

type Props = {
  errorText?: string;
  isError?: boolean | null;
  className?: string;
  tryAgain: () => void;
};

export const ErrorComponent: FC<Props> = ({ errorText, isError, className, tryAgain }) => {
  if (!isError && isError !== undefined) return null;

  return (
    <div className={clsx('flex h-full w-full items-center justify-center p-4', className)}>
      <div className="w-full max-w-[500px] rounded-xl border border-surface-600 bg-card p-4 text-center">
        <Typography variant="h2" className="mb-4">
          Something went wrong
        </Typography>
        <Image
          className="mx-auto h-full w-1/2"
          src={withBasePath('/errorPageImage.png')}
          alt="error image"
          width={528}
          height={528}
        />
        <Typography variant="p" className="mb-6 break-words">
          {errorText ?? 'An unexpected error occurred'}
        </Typography>
        <Button variant="ghost" onClick={tryAgain} className="mt-4" fullWidth>
          Try Again
        </Button>
      </div>
    </div>
  );
};
