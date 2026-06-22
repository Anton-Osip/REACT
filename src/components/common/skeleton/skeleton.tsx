import { type ComponentPropsWithoutRef, type FC } from 'react';

import { twMerge } from 'tailwind-merge';

export type SkeletonProps = {
  className?: string;
} & ComponentPropsWithoutRef<'div'>;

const skeletonBaseClassName = 'skeleton-shimmer h-10 w-full shrink-0 rounded-xl animate-shimmer';

export const Skeleton: FC<SkeletonProps> = ({ className, ...rest }) => {
  return <div className={twMerge(skeletonBaseClassName, className)} {...rest} />;
};
