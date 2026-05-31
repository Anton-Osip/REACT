import { type ComponentPropsWithoutRef, type FC, type ReactNode } from 'react';

import clsx from 'clsx';

import s from './modal.module.css';

type BodyProps = {
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<'div'>;

export const ModalBody: FC<BodyProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx(s.body, className)} {...props}>
      {children}
    </div>
  );
};
