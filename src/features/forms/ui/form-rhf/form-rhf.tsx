import { type FC } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';

import {
  type UserFormData,
  type UserFormInput,
  userSchema,
} from '@/features/forms/lib/form.schema.ts';
import { useFormsStore } from '@/features/forms/model/forms.store.ts';
import { GenderOption } from '@/features/forms/model/forms.types.ts';
import {
  Button,
  CheckboxFieldController,
  PasswordFieldController,
  RadioFieldController,
  TextFieldController,
} from '@/shared/ui';
import { useModal } from '@/shared/ui/modal/model';

import s from './form-rhf.module.css';

type Props = {
  className?: string;
};

export const FormRhf: FC<Props> = ({ className }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UserFormInput, unknown, UserFormData>({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: 0,
      email: '',
      gender: GenderOption.female,
      termsAccepted: false,
      password: '',
      confirmPassword: '',
    },
  });

  const { addSubmissionCard } = useFormsStore();
  const { onClose } = useModal();

  const onSubmit = async (data: UserFormData) => {
    addSubmissionCard({
      age: data.age,
      country: 'BLR',
      formVariant: 'rhf',
      email: data.email,
      gender: data.gender,
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      name: data.name,
      termsAccepted: data.termsAccepted,
    });
    reset();
    onClose();
  };

  return (
    <form className={clsx(s.form, className)} onSubmit={handleSubmit(onSubmit)}>
      <TextFieldController
        label={'Name'}
        name={'name'}
        control={control}
        placeholder={'Name'}
        errorText={errors?.name?.message}
        isError={Boolean(errors?.name?.message)}
      />

      <TextFieldController
        label={'Age'}
        name={'age'}
        control={control}
        placeholder={'Age'}
        errorText={errors?.age?.message}
        isError={Boolean(errors?.age?.message)}
        type={'number'}
      />

      <TextFieldController
        label={'Email'}
        name={'email'}
        control={control}
        placeholder={'Email'}
        errorText={errors?.email?.message}
        isError={Boolean(errors?.email?.message)}
      />

      <RadioFieldController
        name={'gender'}
        label={'Gender'}
        control={control}
        options={[
          { label: GenderOption.female, value: GenderOption.female },
          { label: GenderOption.male, value: GenderOption.male },
        ]}
      />

      <PasswordFieldController
        label={'Password'}
        name={'password'}
        control={control}
        placeholder={'Password'}
        errorText={errors?.password?.message}
        isError={Boolean(errors?.password?.message)}
      />

      <PasswordFieldController
        label={'Confirm password'}
        name={'confirmPassword'}
        control={control}
        placeholder={'Confirm password'}
        errorText={errors?.confirmPassword?.message}
        isError={Boolean(errors?.confirmPassword?.message)}
        withPasswordStrengthIndicator={true}
      />

      <CheckboxFieldController
        name={'termsAccepted'}
        control={control}
        label={'Accept terms'}
        errorText={errors?.termsAccepted?.message}
      />

      <Button disabled={!isValid} type={'submit'}>
        Submit
      </Button>
    </form>
  );
};
