import type { FormSubmission, FormVariant } from './forms.types.ts';

export const FORM_VARIANT_LABELS: Record<FormVariant, string> = {
  uncontrolled: 'Uncontrolled',
  rhf: 'React Hook Form',
};

export const formatSubmittedAt = (timestamp: string) => {
  const date = new Date(Number(timestamp));

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export const formatGender = (gender: FormSubmission['gender']) =>
  gender.charAt(0).toUpperCase() + gender.slice(1);
