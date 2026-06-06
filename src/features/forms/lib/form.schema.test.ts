import { describe, expect, it } from 'vitest';

import { GenderOption } from '@/features/forms/model/forms.types.ts';

import { userSchema } from './form.schema.ts';
import { USER_FORM_VALIDATION_MESSAGES } from './form.validation-messages.ts';

const validData = {
  name: 'John',
  age: 25,
  email: 'john@example.com',
  gender: GenderOption.male,
  termsAccepted: true,
  password: 'secret',
  confirmPassword: 'secret',
};

describe('userSchema', () => {
  it('accepts valid form data', () => {
    const result = userSchema.safeParse(validData);

    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = userSchema.safeParse({ ...validData, name: '' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        USER_FORM_VALIDATION_MESSAGES.name.empty
      );
    }
  });

  it('rejects name that does not start with uppercase letter', () => {
    const result = userSchema.safeParse({ ...validData, name: 'john' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        USER_FORM_VALIDATION_MESSAGES.name.uppercaseFirst
      );
    }
  });

  it('coerces string age to number', () => {
    const result = userSchema.safeParse({ ...validData, age: '30' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.age).toBe(30);
    }
  });

  it('rejects negative age', () => {
    const result = userSchema.safeParse({ ...validData, age: -1 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        USER_FORM_VALIDATION_MESSAGES.age.negative
      );
    }
  });

  it('rejects age above 120', () => {
    const result = userSchema.safeParse({ ...validData, age: 121 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        USER_FORM_VALIDATION_MESSAGES.age.invalid
      );
    }
  });

  it('rejects invalid email', () => {
    const result = userSchema.safeParse({
      ...validData,
      email: 'not-an-email',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        USER_FORM_VALIDATION_MESSAGES.email.invalid
      );
    }
  });

  it('rejects password shorter than 6 characters', () => {
    const result = userSchema.safeParse({
      ...validData,
      password: '12345',
      confirmPassword: '12345',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        USER_FORM_VALIDATION_MESSAGES.password.minLength
      );
    }
  });

  it('rejects mismatched passwords', () => {
    const result = userSchema.safeParse({
      ...validData,
      password: 'secret',
      confirmPassword: 'different',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find(
        (issue) => issue.path[0] === 'confirmPassword'
      );
      expect(confirmError?.message).toBe(
        USER_FORM_VALIDATION_MESSAGES.password.mismatch
      );
    }
  });
});
