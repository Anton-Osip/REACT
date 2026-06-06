import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { USER_FORM_VALIDATION_MESSAGES } from '@/features/forms/lib/form.validation-messages.ts';
import { useFormsStore } from '@/features/forms/model/forms.store.ts';
import { Modal } from '@/shared/ui';

import { FormUncontrolled } from './form-uncontrolled.tsx';

const renderFormUncontrolled = (onClose = vi.fn()) =>
  render(
    <Modal isOpen onClose={onClose}>
      <FormUncontrolled />
    </Modal>
  );

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Name'), 'John');
  await user.type(screen.getByLabelText('Age'), '25');
  await user.type(screen.getByLabelText('Email'), 'john@example.com');
  await user.click(screen.getByLabelText('male'));
  await user.type(screen.getByLabelText('Password'), 'secret');
  await user.type(screen.getByLabelText('Confirm password'), 'secret');
  await user.click(screen.getByRole('checkbox', { name: 'Accept terms' }));
};

describe('FormUncontrolled', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    useFormsStore.setState({ submissions: [] });
  });

  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
    useFormsStore.setState({ submissions: [] });
  });

  it('renders form fields', () => {
    renderFormUncontrolled();

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('male')).toBeInTheDocument();
    expect(screen.getByLabelText('female')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('shows validation errors when submitting an empty form', async () => {
    renderFormUncontrolled();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      screen.getByText(USER_FORM_VALIDATION_MESSAGES.name.empty)
    ).toBeInTheDocument();
    expect(
      screen.getByText(USER_FORM_VALIDATION_MESSAGES.email.invalid)
    ).toBeInTheDocument();
    expect(
      screen.getByText(USER_FORM_VALIDATION_MESSAGES.gender.invalid)
    ).toBeInTheDocument();
    expect(
      screen.getByText(USER_FORM_VALIDATION_MESSAGES.password.minLength)
    ).toBeInTheDocument();
    expect(useFormsStore.getState().submissions).toHaveLength(0);
  });

  it('shows validation error when name starts with lowercase letter', async () => {
    renderFormUncontrolled();

    await user.type(screen.getByLabelText('Name'), 'john');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      screen.getByText(USER_FORM_VALIDATION_MESSAGES.name.uppercaseFirst)
    ).toBeInTheDocument();
  });

  it('shows validation error when passwords do not match', async () => {
    renderFormUncontrolled();

    await user.type(screen.getByLabelText('Name'), 'John');
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.click(screen.getByLabelText('male'));
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.type(screen.getByLabelText('Confirm password'), 'different');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      screen.getByText(USER_FORM_VALIDATION_MESSAGES.password.mismatch)
    ).toBeInTheDocument();
    expect(useFormsStore.getState().submissions).toHaveLength(0);
  });

  it('adds submission to the store on valid submit', async () => {
    renderFormUncontrolled();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    const { submissions } = useFormsStore.getState();
    expect(submissions).toHaveLength(1);
    expect(submissions[0]).toMatchObject({
      name: 'John',
      age: 25,
      email: 'john@example.com',
      gender: 'male',
      termsAccepted: true,
      formVariant: 'uncontrolled',
      country: 'BLR',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    });
  });

  it('resets form fields after successful submit', async () => {
    renderFormUncontrolled();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Age')).toHaveValue(null);
    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByLabelText('Password')).toHaveValue('');
    expect(screen.getByLabelText('Confirm password')).toHaveValue('');
    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' })
    ).not.toBeChecked();
    expect(screen.getByLabelText('male')).not.toBeChecked();
    expect(screen.getByLabelText('female')).not.toBeChecked();
  });

  it('calls onClose after successful submit', async () => {
    const onClose = vi.fn();
    renderFormUncontrolled(onClose);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
