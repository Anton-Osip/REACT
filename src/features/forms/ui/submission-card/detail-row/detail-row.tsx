import type { FC, ReactNode } from 'react';

import clsx from 'clsx';

import { Typography } from '@/shared/ui';

import s from './detail-row.module.css';

export type DetailRowProps = {
  className?: string;
  label: string;
  value: ReactNode;
};

export const DetailRow: FC<DetailRowProps> = ({ className, label, value }) => (
  <div className={clsx(s.detailRow, className)}>
    <Typography className={s.label} variant="caption">
      {label}
    </Typography>
    <Typography className={s.value} variant="overline">
      {value}
    </Typography>
  </div>
);
