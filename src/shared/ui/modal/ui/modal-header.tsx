import { type ComponentPropsWithoutRef, type FC, type ReactNode } from 'react';

import clsx from 'clsx';

import s from './modal.module.css';

type HeaderProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<'header'>;

export const ModalHeader: FC<HeaderProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <header className={clsx(s.header, className)} {...props}>
      {children}
    </header>
  );
};
