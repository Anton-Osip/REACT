import { type ComponentPropsWithoutRef, type FC } from 'react';

import clsx from 'clsx';

export type SkeletonProps = {
  className?: string;
} & ComponentPropsWithoutRef<'div'>;

const skeletonBaseClassName = 'skeleton-shimmer h-full w-full rounded-xl animate-shimmer';

export const Skeleton: FC<SkeletonProps> = ({ className, ...rest }) => {
  return <div className={clsx(skeletonBaseClassName, className)} {...rest} />;
};
