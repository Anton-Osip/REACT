import { z } from 'zod';

import { GenderOption } from '@/features/forms/model/forms.types.ts';

import { USER_FORM_VALIDATION_MESSAGES } from './form.validation-messages.ts';

export const userSchema = z
  .object({
    name: z
      .string()
      .min(1, USER_FORM_VALIDATION_MESSAGES.name.empty)
      .refine((str) => str.length > 0 && str[0] === str[0].toUpperCase(), {
        message: USER_FORM_VALIDATION_MESSAGES.name.uppercaseFirst,
      }),
    age: z.preprocess(
      (val) => {
        if (typeof val === 'string') {
          const num = Number(val);
          return isNaN(num) ? val : num;
        }
        return val;
      },
      z
        .number()
        .min(0, USER_FORM_VALIDATION_MESSAGES.age.negative)
        .max(120, USER_FORM_VALIDATION_MESSAGES.age.invalid)
    ),
    email: z
      .string()
      .trim()
      .pipe(z.email(USER_FORM_VALIDATION_MESSAGES.email.invalid)),
    gender: z.enum([GenderOption.male, GenderOption.female], {
      message: USER_FORM_VALIDATION_MESSAGES.gender.invalid,
    }),
    termsAccepted: z.boolean(),
    password: z
      .string()
      .min(6, USER_FORM_VALIDATION_MESSAGES.password.minLength),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: USER_FORM_VALIDATION_MESSAGES.password.mismatch,
    path: ['confirmPassword'],
  });

export type UserFormInput = z.input<typeof userSchema>;
export type UserFormData = z.output<typeof userSchema>;
