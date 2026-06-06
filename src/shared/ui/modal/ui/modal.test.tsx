import { type ReactNode } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Modal } from './modal.tsx';

function renderModal(
  ui: ReactNode,
  {
    isOpen = true,
    onClose = vi.fn(),
  }: { isOpen?: boolean; onClose?: () => void } = {}
) {
  return {
    onClose,
    ...render(
      <Modal isOpen={isOpen} onClose={onClose}>
        {ui}
      </Modal>
    ),
  };
}

describe('Modal', () => {
  const user = userEvent.setup();

  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
  });

  it('returns null when isOpen is false', () => {
    renderModal(<div>Modal content</div>, { isOpen: false });

    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('renders children in a portal when isOpen is true', () => {
    renderModal(<div>Modal content</div>);

    const content = screen.getByText('Modal content');
    expect(content).toBeInTheDocument();
    expect(document.body.contains(content)).toBe(true);
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    renderModal(<div>Modal content</div>, { onClose });

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll while open and restores it on close', () => {
    document.body.style.overflow = 'auto';

    const { rerender } = render(
      <Modal isOpen onClose={vi.fn()}>
        <div>Modal content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal isOpen={false} onClose={vi.fn()}>
        <div>Modal content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('auto');
  });

  it('renders compound layout with header, body and footer', () => {
    renderModal(
      <>
        <Modal.Header>Title</Modal.Header>
        <Modal.Body>Body text</Modal.Body>
        <Modal.Footer>Actions</Modal.Footer>
      </>
    );

    expect(screen.getByRole('banner')).toHaveTextContent('Title');
    expect(screen.getByText('Body text').tagName).toBe('DIV');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Actions');
  });

  it('merges className on container, header, body and footer', () => {
    renderModal(
      <>
        <Modal.Container className="custom-container" data-testid="container">
          <Modal.Header className="custom-header">Title</Modal.Header>
          <Modal.Body className="custom-body">Body</Modal.Body>
          <Modal.Footer className="custom-footer">Actions</Modal.Footer>
        </Modal.Container>
      </>
    );

    expect(screen.getByTestId('container')).toHaveClass('custom-container');
    expect(screen.getByRole('banner')).toHaveClass('custom-header');
    expect(screen.getByText('Body')).toHaveClass('custom-body');
    expect(screen.getByRole('contentinfo')).toHaveClass('custom-footer');
  });

  it('calls onClose when overlay is clicked', async () => {
    const onClose = vi.fn();
    renderModal(<Modal.Overlay data-testid="overlay" />, { onClose });

    await user.click(screen.getByTestId('overlay'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    renderModal(<Modal.CloseButton aria-label="Close modal" />, { onClose });

    await user.click(screen.getByRole('button', { name: 'Close modal' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders custom close button content when buttonContent is provided', () => {
    renderModal(<Modal.CloseButton buttonContent="Dismiss" />);

    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveTextContent(
      'Dismiss'
    );
  });

  it('renders cross icon in close button by default', () => {
    renderModal(<Modal.CloseButton aria-label="Close modal" />);

    expect(
      screen.getByRole('button', { name: 'Close modal' })
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  it('renders dialog semantics on container', () => {
    renderModal(
      <Modal.Container labelledBy="modal-title" describedBy="modal-desc">
        <h2 id="modal-title">Title</h2>
        <p id="modal-desc">Description</p>
      </Modal.Container>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-desc');
  });

  it('marks overlay as aria-hidden', () => {
    renderModal(<Modal.Overlay data-testid="overlay" />);

    expect(screen.getByTestId('overlay')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('does not close when clicking inside the container', async () => {
    const onClose = vi.fn();
    renderModal(
      <Modal.Container data-testid="container">
        <button type="button">Inside</button>
      </Modal.Container>,
      { onClose }
    );

    await user.click(screen.getByRole('button', { name: 'Inside' }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('moves focus to the first focusable element in the container', () => {
    renderModal(
      <Modal.Container>
        <button type="button">First</button>
        <button type="button">Second</button>
      </Modal.Container>
    );

    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });

  it('traps Tab focus inside the dialog', async () => {
    renderModal(
      <Modal.Container>
        <button type="button">First</button>
        <button type="button">Last</button>
      </Modal.Container>
    );

    screen.getByRole('button', { name: 'Last' }).focus();
    await user.tab();

    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });
});
