import { type ComponentPropsWithoutRef, type FC, type ReactNode } from 'react';

import { clsx } from 'clsx';

export type ContainerProps = {
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<'div'>;

const baseStyles = 'w-full max-w-[1240px] px-4 mx-auto';

export const Container: FC<ContainerProps> = ({ className, children, ...rest }) => {
  return (
    <div className={clsx(baseStyles, className)} {...rest}>
      {children}
    </div>
  );
};
