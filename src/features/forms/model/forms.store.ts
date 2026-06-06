import { create } from 'zustand/react';

import type {
  FormSubmission,
  UserCard,
} from '@/features/forms/model/forms.types.ts';

export type FormsState = {
  submissions: UserCard[];
  addSubmissionCard: (value: FormSubmission) => void;
  lastAddedCardId: string | null;
  countries: string[];
};

let highlightTimeoutId: ReturnType<typeof setTimeout> | undefined;

export const useFormsStore = create<FormsState>((set) => ({
  submissions: [],
  lastAddedCardId: null,

  addSubmissionCard: (value) => {
    const submittedAt = Date.now().toString();
    const newCard: UserCard = {
      ...value,
      id: submittedAt,
      submittedAt,
    };

    if (highlightTimeoutId) clearTimeout(highlightTimeoutId);

    set((state) => ({
      submissions: [newCard, ...state.submissions],
      lastAddedCardId: newCard.id,
    }));

    highlightTimeoutId = setTimeout(() => {
      set({ lastAddedCardId: null });
    }, 3000);
  },

  countries: [],
}));
