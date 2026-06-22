'use client';

import type { FC } from 'react';

import { useTranslations } from 'next-intl';

import { ErrorComponent } from '@components/layout';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

const Error: FC<Props> = ({ error, reset }) => {
  const t = useTranslations('Error');

  return <ErrorComponent title={t('title')} message={error.message} actionLabel={t('tryAgain')} onAction={reset} />;
};

export default Error;
