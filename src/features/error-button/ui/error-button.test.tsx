import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ErrorBoundary } from '@/features/error-boundary';

import { useErrorButtonStore } from '../model';

import { ErrorButton } from './error-button.tsx';

function resetStore() {
  useErrorButtonStore.setState({ shouldThrowError: false });
}

describe('ErrorButton', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders Error Button', () => {
    render(<ErrorButton />);

    expect(
      screen.getByRole('button', { name: 'Error Button' })
    ).toBeInTheDocument();
  });

  it('applies custom className to the button', () => {
    render(<ErrorButton className="custom-trigger" />);

    expect(screen.getByRole('button', { name: 'Error Button' })).toHaveClass(
      'custom-trigger'
    );
  });

  it('sets shouldThrowError in store when clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: 'Error Button' }));

    expect(useErrorButtonStore.getState().shouldThrowError).toBe(true);

    consoleSpy.mockRestore();
  });

  it('throws an error caught by error boundary after click', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: 'Error Button' }));

    expect(
      await screen.findByText(
        'Test error from Error Footer - Check console for details'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('reloads the page when Try Again is clicked on error boundary', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: reloadSpy },
    });

    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: 'Error Button' }));

    expect(
      await screen.findByText(
        'Test error from Error Footer - Check console for details'
      )
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(reloadSpy).toHaveBeenCalledOnce();

    consoleSpy.mockRestore();
  });
});
