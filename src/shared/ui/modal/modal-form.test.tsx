import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from '@/shared/ui';

import { ModalForm } from './modal-form.tsx';

describe('ModalForm', () => {
  const user = userEvent.setup();

  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
  });

  it('does not render modal content before the trigger is clicked', () => {
    render(
      <ModalForm trigger={<Button>Open form</Button>} title="Test form">
        <div>Form content</div>
      </ModalForm>
    );

    expect(screen.queryByText('Form content')).not.toBeInTheDocument();
  });

  it('opens modal with title and children when trigger is clicked', async () => {
    render(
      <ModalForm trigger={<Button>Open form</Button>} title="Test form">
        <div>Form content</div>
      </ModalForm>
    );

    await user.click(screen.getByRole('button', { name: 'Open form' }));

    expect(screen.getByText('Test form')).toBeInTheDocument();
    expect(screen.getByText('Form content')).toBeInTheDocument();
  });

  it('calls the original trigger onClick handler before opening', async () => {
    const onTriggerClick = vi.fn();

    render(
      <ModalForm
        trigger={<Button onClick={onTriggerClick}>Open form</Button>}
        title="Test form"
      >
        <div>Form content</div>
      </ModalForm>
    );

    await user.click(screen.getByRole('button', { name: 'Open form' }));

    expect(onTriggerClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Form content')).toBeInTheDocument();
  });

  it('closes modal when overlay is clicked', async () => {
    render(
      <ModalForm trigger={<Button>Open form</Button>} title="Test form">
        <div>Form content</div>
      </ModalForm>
    );

    await user.click(screen.getByRole('button', { name: 'Open form' }));
    expect(screen.getByText('Form content')).toBeInTheDocument();

    const overlay = document.querySelector('[aria-hidden="true"]');

    expect(overlay).toBeInstanceOf(HTMLElement);
    await user.click(overlay as HTMLElement);

    expect(screen.queryByText('Form content')).not.toBeInTheDocument();
  });
});
