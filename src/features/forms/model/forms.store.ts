import { create } from 'zustand/react';

import type {
  FormSubmission,
  UserCard,
} from '@/features/forms/model/forms.types.ts';

export type FormsState = {
  submissions: UserCard[];
  addSubmissionCard: (value: FormSubmission) => void;
  countries: string[];
};

export const useFormsStore = create<FormsState>((set) => ({
  submissions: [],

  addSubmissionCard: (value) => {
    const submittedAt = new Date().getTime().toString();
    const newCard: UserCard = {
      ...value,
      id: submittedAt,
      submittedAt: submittedAt,
    };

    set((state) => {
      return { submissions: [newCard, ...state.submissions] };
    });
  },
  countries: [],
}));
