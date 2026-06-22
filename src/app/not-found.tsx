import type { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { withBasePath } from '@/utils';
import { Typography } from '@components/common';

const NotFound: FC = () => {
  return (
    <html lang="en">
      <body className="flex h-dvh w-dvw items-center justify-center">
        <div className="flex w-full max-w-2/3 flex-col items-center justify-center gap-4 p-4 text-center">
          <Typography variant="h1">404 — Page not found</Typography>
          <Image src={withBasePath('/errorPageImage.png')} alt="error message" width={528} height={528} />
          <Typography variant="h3">The page you are looking for does not exist.</Typography>
          <Link href="/" className="text-brand-500 underline-offset-2 hover:underline">
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
};

export default NotFound;
