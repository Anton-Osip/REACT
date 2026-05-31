import { createContext, type RefObject } from 'react';

export type ModalContextType = {
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined
);
