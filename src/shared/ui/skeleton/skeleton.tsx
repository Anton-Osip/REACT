import { type ComponentPropsWithoutRef, type FC } from 'react';

import clsx from 'clsx';

import s from './skeleton.module.css';

export type SkeletonProps = {
  className?: string;
} & ComponentPropsWithoutRef<'div'>;

export const Skeleton: FC<SkeletonProps> = ({ className, ...rest }) => {
  return <div className={clsx(s.skeleton, className)} {...rest}></div>;
};
