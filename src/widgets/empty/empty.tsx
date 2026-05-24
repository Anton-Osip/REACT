import { type FC } from 'react';

import clsx from 'clsx';

import emptyPageImage from '@/shared/assets/image/emptyPageImage.png';
import { Typography } from '@/shared/ui';

import s from './empty.module.css';

type Props = {
  isEmpty?: boolean | null;
  emptyText?: string;
  className?: string;
};

export const EmptyComponent: FC<Props> = ({
  isEmpty,
  emptyText,
  className,
}) => {
  if (!isEmpty) return null;
  return (
    <div className={clsx(s.empty, className)}>
      <img className={s.emptyImage} src={emptyPageImage} alt="empty page" />
      <Typography className={s.emptyText} variant={'h3'}>
        {emptyText ?? 'Nothing found.'}
      </Typography>
    </div>
  );
};
