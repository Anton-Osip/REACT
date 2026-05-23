import { type ComponentPropsWithoutRef, type FC, type ReactNode } from 'react';

import clsx from 'clsx';

import s from './container.module.css';

export type ContainerProps = {
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<'div'>;

export const Container: FC<ContainerProps> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <div className={clsx(s.container, className)} {...rest}>
      {children}
    </div>
  );
};
