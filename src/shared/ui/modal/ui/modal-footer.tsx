import { type ComponentPropsWithoutRef, type FC, type ReactNode } from 'react';

import clsx from 'clsx';

import s from './modal.module.css';

type FooterProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<'footer'>;

export const ModalFooter: FC<FooterProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <footer className={clsx(s.footer, className)} {...props}>
      {children}
    </footer>
  );
};
