'use client';

import type { FC } from 'react';

import { clsx } from 'clsx';
import Image from 'next/image';

import { withBasePath } from '@/utils';
import { Button, Typography } from '@components/common';

type Props = {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
  className?: string;
};

export const ErrorComponent: FC<Props> = ({
  title = 'ERROR',
  message,
  actionLabel = 'Back to Home',
  onAction,
  href,
  className,
}) => {
  return (
    <div className={clsx('flex h-full min-h-0 w-full overflow-y-auto', className)}>
      <div
        className={
          'mx-auto flex min-h-full w-full max-w-2/3 flex-col items-center ' + 'justify-center gap-4 p-4 text-center'
        }
      >
        <Typography variant="h1">{title}</Typography>
        <Image
          src={withBasePath('/errorPageImage.png')}
          alt="error message"
          width={528}
          height={528}
          className="h-auto w-full max-w-60 object-contain"
        />
        <Typography variant="h3" className="wrap-break-word">
          {message}
        </Typography>
        <Button variant="primary" onClick={onAction} href={href} fullWidth>
          {actionLabel}
        </Button>
      </div>
    </div>
  );
};
