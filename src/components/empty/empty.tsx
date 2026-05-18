import clsx from 'clsx';
import { type FC } from 'react';
import s from './empty.module.css';
import { Typography } from '../typography';
import emptyPageImage from '../../assets/image/emptyPageImage.png';

interface EmptyProps {
  isEmpty?: boolean | null;
  emptyText?: string;
  className?: string;
}

export const EmptyComponent: FC<EmptyProps> = ({
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
