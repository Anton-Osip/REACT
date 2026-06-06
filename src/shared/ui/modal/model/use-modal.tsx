import { useContext } from 'react';

import { ModalContext } from './modal.context.ts';

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal.* компонент должен использоваться внутри <Modal>');
  }
  return context;
};
