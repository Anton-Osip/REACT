import { useState } from 'react';

import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Modal } from '../ui/modal.tsx';

describe('useModalFocus (via Modal.Container)', () => {
  const user = userEvent.setup();

  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
  });

  it('moves focus to the first focusable element when modal opens', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <Modal.Container>
          <button type="button">First</button>
          <button type="button">Second</button>
        </Modal.Container>
      </Modal>
    );

    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });

  it('traps Tab focus inside the dialog', async () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        <Modal.Container>
          <button type="button">First</button>
          <button type="button">Last</button>
        </Modal.Container>
      </Modal>
    );

    const last = screen.getByRole('button', { name: 'Last' });
    last.focus();

    await user.tab();

    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });

  it('returns focus to returnFocusRef when modal closes', () => {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.textContent = 'Open';
    document.body.appendChild(trigger);
    trigger.focus();

    const returnFocusRef = { current: trigger };

    const Wrapper = () => {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          returnFocusRef={returnFocusRef}
        >
          <Modal.Container>
            <button type="button">Inside</button>
          </Modal.Container>
        </Modal>
      );
    };

    const { rerender } = render(<Wrapper />);

    expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();

    rerender(
      <Modal isOpen={false} onClose={vi.fn()} returnFocusRef={returnFocusRef}>
        <Modal.Container>
          <button type="button">Inside</button>
        </Modal.Container>
      </Modal>
    );

    expect(trigger).toHaveFocus();
    trigger.remove();
  });

  it('returns focus to the element that was active before open', () => {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.textContent = 'Trigger';
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender } = render(
      <Modal isOpen onClose={vi.fn()}>
        <Modal.Container>
          <button type="button">Inside</button>
        </Modal.Container>
      </Modal>
    );

    rerender(
      <Modal isOpen={false} onClose={vi.fn()}>
        <Modal.Container>
          <button type="button">Inside</button>
        </Modal.Container>
      </Modal>
    );

    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});
