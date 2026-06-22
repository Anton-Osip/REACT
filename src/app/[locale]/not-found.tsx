import type { FC } from 'react';

import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { withBasePath } from '@/utils';
import { Button, Typography } from '@components/common';

const NotFound: FC = async () => {
  const t = await getTranslations('NotFound');

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-2/3 flex-col items-center justify-center gap-4 p-4 text-center">
        <Typography variant="h1">{t('title')}</Typography>
        <Image src={withBasePath('/errorPageImage.png')} alt="error message" width={528} height={528} />
        <Typography variant="h3">{t('description')}</Typography>
        <Button variant="primary" href="/" fullWidth>
          {t('backToHome')}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
