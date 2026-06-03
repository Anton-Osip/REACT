import {
  cloneElement,
  type FC,
  isValidElement,
  type ReactNode,
  useCallback,
  useState,
} from 'react';

import { Modal } from '@/shared/ui';

type Props = {
  className?: string;
  trigger: ReactNode;
  title?: string;
  children: ReactNode;
};

export const ModalForm: FC<Props> = ({ trigger, title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);

  const triggerElement = isValidElement<{ onClick?: () => void }>(trigger)
    ? cloneElement(trigger, {
        onClick: () => {
          trigger.props.onClick?.();
          open();
        },
      })
    : trigger;

  return (
    <>
      {triggerElement}
      <Modal isOpen={isOpen} onClose={onClose}>
        <Modal.Overlay />
        <Modal.Container>
          <Modal.Header>
            {title && title} <Modal.CloseButton />
          </Modal.Header>

          <Modal.Body>{children}</Modal.Body>
        </Modal.Container>
      </Modal>
    </>
  );
};
