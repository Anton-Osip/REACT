import { create } from 'zustand/react';

type ErrorButtonState = {
  shouldThrowError: boolean;
  simulateError: () => void;
};

export const useErrorButtonStore = create<ErrorButtonState>((set) => ({
  shouldThrowError: false,

  simulateError: () => {
    set({ shouldThrowError: true });
  },
}));
