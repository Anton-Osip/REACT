export const GenderOption = {
  male: 'male',
  female: 'female',
} as const;

export type Gender = keyof typeof GenderOption;

export const FormVariant = {
  uncontrolled: 'uncontrolled',
  rhf: 'rhf',
} as const;

export type FormVariant = keyof typeof FormVariant;

export type FormSubmission = {
  name: string;
  age: number;
  email: string;
  gender: Gender;
  termsAccepted: boolean;
  country: string;
  image: string;
  formVariant: FormVariant;
};

export type UserCard = {
  id: string;
  submittedAt: string;
} & FormSubmission;
