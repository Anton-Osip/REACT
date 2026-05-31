import { create } from 'zustand/react';

import type { FormSubmission } from '@/features/forms/model/forms.types.ts';

export type FormsState = {
  submissions: FormSubmission[];
  lastSubmissionId: string | null;
  countries: string[];
};

export const useFormsStore = create<FormsState>(() => ({
  submissions: [
    {
      id: '1',
      age: 29,
      country: 'BLR',
      formVariant: 'uncontrolled',
      email: 'test@gmail.com',
      gender: 'male',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      name: 'Anton',
      submittedAt: '879865413468',
      termsAccepted: false,
    },
    {
      id: '2',
      age: 29,
      country: 'BLR',
      formVariant: 'rhf',
      email: 'test@gmail.com',
      gender: 'male',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      name: 'Anton',
      submittedAt: '879865413468',
      termsAccepted: false,
    },
    {
      id: '3',
      age: 29,
      country: 'BLR',
      formVariant: 'rhf',
      email: 'test@gmail.com',
      gender: 'male',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      name: 'Anton',
      submittedAt: '879865413468',
      termsAccepted: true,
    },
  ],
  lastSubmissionId: '1',
  countries: [],
}));
