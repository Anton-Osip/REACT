import type { FC } from 'react';

import Image from 'next/image';

import { ROUTES } from '@/constants';
import { withBasePath } from '@/utils';
import { Button, Typography } from '@components/common';

const NotFound: FC = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center max-w-2/3 w-full p-4 flex flex-col items-center justify-center gap-4">
        <Typography variant="h1">404 — Page not found</Typography>
        <Image src={withBasePath('/errorPageImage.png')} alt="error message" width={528} height={528} />
        <Typography variant="h3">The page you are looking for does not exist.</Typography>
        <Button variant="primary" href={ROUTES.CHARACTERS} fullWidth>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
