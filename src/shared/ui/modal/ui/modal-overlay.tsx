import { type ComponentPropsWithoutRef, type FC } from 'react';

import clsx from 'clsx';

import { useModal } from '../model';

import s from './modal.module.css';

type OverlayProps = { className?: string } & ComponentPropsWithoutRef<'div'>;

export const ModalOverlay: FC<OverlayProps> = ({ className, ...props }) => {
  const { onClose } = useModal();

  return (
    <div
      className={clsx(s.overlay, className)}
      aria-hidden="true"
      onClick={onClose}
      {...props}
    />
  );
};
