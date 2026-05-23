import { create } from 'zustand/react';

type SimulateErrorState = {
  shouldThrowError: boolean;
  simulateError: () => void;
};

export const useSimulateErrorStore = create<SimulateErrorState>((set) => ({
  shouldThrowError: false,

  simulateError: () => {
    set({ shouldThrowError: true });
  },
}));
