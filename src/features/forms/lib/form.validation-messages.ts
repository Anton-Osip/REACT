export const USER_FORM_VALIDATION_MESSAGES = {
  name: {
    empty: 'Cannot be empty',
    uppercaseFirst: 'First letter must be uppercase',
  },
  age: {
    negative: 'Age cannot be negative',
    invalid: 'Invalid age',
  },
  email: {
    invalid: 'Invalid email format',
  },
  gender: {
    invalid: 'Select male or female',
  },
  termsAccepted: {
    required: 'You must accept the terms',
  },
  password: {
    minLength: 'Password must contain at least 6 characters',
    mismatch: 'Passwords do not match',
  },
} as const;
