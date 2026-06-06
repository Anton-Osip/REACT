import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Modal } from '@/shared/ui';

import { FormRhf } from './form-rhf.tsx';

const renderFormRhf = (props?: { className?: string }) =>
  render(
    <Modal isOpen onClose={() => {}}>
      <FormRhf {...props} />
    </Modal>
  );

describe('FormRhf', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders form fields', () => {
    renderFormRhf();

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Accept terms' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('merges custom className onto the root element', () => {
    renderFormRhf({ className: 'custom-form' });

    expect(document.querySelector('form.custom-form')).toBeInTheDocument();
  });
});
