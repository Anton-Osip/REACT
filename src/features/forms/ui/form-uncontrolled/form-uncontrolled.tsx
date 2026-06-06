import { type SubmitEvent, useRef, useState } from 'react';

import { z } from 'zod';

import { userSchema } from '@/features/forms/lib/form.schema.ts';
import { useFormsStore } from '@/features/forms/model/forms.store.ts';
import { GenderOption } from '@/features/forms/model/forms.types.ts';
import {
  Button,
  CheckboxField,
  PasswordField,
  RadioField,
  TextField,
} from '@/shared/ui';
import { useModal } from '@/shared/ui/modal/model';

import s from './form-uncontrolled.module.css';

type FieldErrors = Partial<Record<string, string>>;

function mapZodErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

export const FormUncontrolled = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [gender, setGender] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { addSubmissionCard } = useFormsStore();
  const { onClose } = useModal();

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    setErrors({});

    const form = e.target;
    const formData = new FormData(form);

    const raw = {
      name: formData.get('name'),
      age: formData.get('age'),
      email: formData.get('email'),
      gender: formData.get('gender') ?? gender,
      termsAccepted,
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    };

    const result = userSchema.safeParse(raw);
    if (!result.success) {
      setErrors(mapZodErrors(result.error));
      return;
    }

    addSubmissionCard({
      ...result.data,
      formVariant: 'uncontrolled',
      country: 'BLR',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    });

    form.reset();
    setGender('');
    setTermsAccepted(false);
    onClose();
  };

  return (
    <form
      ref={formRef}
      className={s.uncontrolledForms}
      onSubmit={handleSubmit}
      noValidate
    >
      <TextField
        name="name"
        label="Name"
        placeholder="Name"
        defaultValue=""
        errorText={errors.name}
        isError={Boolean(errors.name)}
      />

      <TextField
        name="age"
        type="number"
        label="Age"
        placeholder="Age"
        defaultValue=""
        errorText={errors.age}
        isError={Boolean(errors.age)}
      />

      <TextField
        name="email"
        type="email"
        label="Email"
        placeholder="Email"
        defaultValue=""
        errorText={errors.email}
        isError={Boolean(errors.email)}
      />

      <RadioField
        name="gender"
        label="Gender"
        options={[
          { label: GenderOption.female, value: GenderOption.female },
          { label: GenderOption.male, value: GenderOption.male },
        ]}
        value={gender}
        onChange={setGender}
        errorText={errors.gender}
      />

      <PasswordField
        name="password"
        label="Password"
        placeholder="Password"
        defaultValue=""
        errorText={errors.password}
        isError={Boolean(errors.password)}
      />

      <PasswordField
        name="confirmPassword"
        label="Confirm password"
        placeholder="Confirm password"
        defaultValue=""
        errorText={errors.confirmPassword}
        isError={Boolean(errors.confirmPassword)}
      />

      <CheckboxField
        checked={termsAccepted}
        onCheckedChange={setTermsAccepted}
        label="Accept terms"
        errorText={errors.termsAccepted}
      />

      <Button type="submit">Submit</Button>
    </form>
  );
};
