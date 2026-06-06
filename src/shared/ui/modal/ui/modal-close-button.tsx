import { type ComponentPropsWithoutRef, type FC } from 'react';

import clsx from 'clsx';

import { Button, CrossIcon } from '@/shared/ui';
import { useModal } from '@/shared/ui/modal/model';

import s from './modal.module.css';

type CloseButtonProps = {
  className?: string;
  buttonContent?: string;
} & ComponentPropsWithoutRef<'button'>;

export const ModalCloseButton: FC<CloseButtonProps> = ({
  className,
  buttonContent,
  ...props
}) => {
  const { onClose } = useModal();

  return (
    <Button
      variant={'primary'}
      className={clsx(s.closeButton, className)}
      onClick={onClose}
      {...props}
    >
      {buttonContent ? buttonContent : <CrossIcon />}
    </Button>
  );
};
