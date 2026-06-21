'use client';

import type { FC } from 'react';

import { ErrorComponent } from '@components/layout';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

const Error: FC<Props> = ({ error, reset }) => {
  return <ErrorComponent message={error.message} onAction={reset} />;
};

export default Error;
