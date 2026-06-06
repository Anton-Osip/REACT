import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { USER_FORM_VALIDATION_MESSAGES } from '@/features/forms/lib/form.validation-messages.ts';
import { useFormsStore } from '@/features/forms/model/forms.store.ts';
import { Modal } from '@/shared/ui';

import { FormRhf } from './form-rhf.tsx';

const renderFormRhf = (onClose = vi.fn(), props?: { className?: string }) =>
  render(
    <Modal isOpen onClose={onClose}>
      <FormRhf {...props} />
    </Modal>
  );

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Name'), 'John');
  await user.clear(screen.getByLabelText('Age'));
  await user.type(screen.getByLabelText('Age'), '25');
  await user.type(screen.getByLabelText('Email'), 'john@example.com');
  await user.click(screen.getByLabelText('male'));
  await user.type(screen.getByLabelText('Password'), 'secret');
  await user.type(screen.getByLabelText('Confirm password'), 'secret');
  await user.click(screen.getByRole('checkbox', { name: 'Accept terms' }));
};

describe('FormRhf', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    useFormsStore.setState({ submissions: [], lastAddedCardId: null });
  });

  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
    useFormsStore.setState({ submissions: [], lastAddedCardId: null });
  });

  it('renders form fields', () => {
    renderFormRhf();

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

  it('merges custom className onto the root element', () => {
    renderFormRhf(vi.fn(), { className: 'custom-form' });

    expect(document.querySelector('form.custom-form')).toBeInTheDocument();
  });

  it('keeps submit button disabled while the form is invalid', () => {
    renderFormRhf();

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('shows validation error when name starts with lowercase letter', async () => {
    renderFormRhf();

    await user.type(screen.getByLabelText('Name'), 'john');

    expect(
      await screen.findByText(USER_FORM_VALIDATION_MESSAGES.name.uppercaseFirst)
    ).toBeInTheDocument();
  });

  it('shows validation error when passwords do not match', async () => {
    renderFormRhf();

    await user.type(screen.getByLabelText('Name'), 'John');
    await user.clear(screen.getByLabelText('Age'));
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.click(screen.getByLabelText('male'));
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.type(screen.getByLabelText('Confirm password'), 'different');

    expect(
      await screen.findByText(USER_FORM_VALIDATION_MESSAGES.password.mismatch)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('enables submit button when the form is valid', async () => {
    renderFormRhf();

    await fillValidForm(user);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
    });
  });

  it('adds submission to the store on valid submit', async () => {
    renderFormRhf();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    const { submissions, lastAddedCardId } = useFormsStore.getState();
    expect(submissions).toHaveLength(1);
    expect(submissions[0]).toMatchObject({
      name: 'John',
      age: 25,
      email: 'john@example.com',
      gender: 'male',
      termsAccepted: true,
      formVariant: 'rhf',
      country: 'BLR',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    });
    expect(lastAddedCardId).toBe(submissions[0]?.id);
  });

  it('resets form fields after successful submit', async () => {
    renderFormRhf();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Age')).toHaveValue(0);
    expect(screen.getByLabelText('Email')).toHaveValue('');
    expect(screen.getByLabelText('Password')).toHaveValue('');
    expect(screen.getByLabelText('Confirm password')).toHaveValue('');
    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' })
    ).not.toBeChecked();
    expect(screen.getByLabelText('female')).toBeChecked();
  });

  it('calls onClose after successful submit', async () => {
    const onClose = vi.fn();
    renderFormRhf(onClose);

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
