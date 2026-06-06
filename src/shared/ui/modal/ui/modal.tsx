import { type FC, type ReactNode, type RefObject, useEffect } from 'react';

import { createPortal } from 'react-dom';

import { ModalBody } from '@/shared/ui/modal/ui/modal-body.tsx';
import { ModalCloseButton } from '@/shared/ui/modal/ui/modal-close-button.tsx';
import { ModalContainer } from '@/shared/ui/modal/ui/modal-container.tsx';
import { ModalFooter } from '@/shared/ui/modal/ui/modal-footer.tsx';
import { ModalHeader } from '@/shared/ui/modal/ui/modal-header.tsx';
import { ModalOverlay } from '@/shared/ui/modal/ui/modal-overlay.tsx';

import { ModalContext } from '../model';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export const Modal: FC<Props> & {
  Overlay: typeof ModalOverlay;
  Container: typeof ModalContainer;
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
  CloseButton: typeof ModalCloseButton;
} = ({ isOpen, onClose, children, returnFocusRef }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ isOpen, onClose, returnFocusRef }}>
      {createPortal(children, document.body)}
    </ModalContext.Provider>
  );
};

Modal.Overlay = ModalOverlay;
Modal.Container = ModalContainer;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.CloseButton = ModalCloseButton;
