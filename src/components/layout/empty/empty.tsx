'use client';

import { type FC } from 'react';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { withBasePath } from '@/utils';
import { Typography } from '@components/common';

type Props = {
  isEmpty?: boolean | null;
  emptyText?: string;
};

export const EmptyComponent: FC<Props> = ({ isEmpty, emptyText }) => {
  const t = useTranslations('Empty');

  if (!isEmpty && isEmpty !== undefined) return null;

  const message = emptyText ?? t('message');

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <Image
        src={withBasePath('/emptyPageImage.png')}
        alt={message}
        className="max-h-[50dvw] max-w-full"
        width={524}
        height={524}
      />

      <Typography className="max-w-2/3 text-center" variant={'h2'}>
        {message}
      </Typography>
    </div>
  );
};
