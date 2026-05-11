import { Component, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from './error-boundary';

class ProblemChild extends Component<
  { shouldThrow?: boolean },
  Record<string, never>
> {
  render(): ReactNode {
    if (this.props.shouldThrow) {
      throw new Error('Child exploded');
    }
    return <div>All good</div>;
  }
}

describe('ErrorBoundary', () => {
  const user = userEvent.setup();

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('renders fallback UI and error message when a child throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Child exploded')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('logs errors from componentDidCatch', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalled();
    const payload = consoleSpy.mock.calls.find(
      (call) =>
        typeof call[0] === 'string' &&
        String(call[0]).includes('ErrorBoundary caught an error')
    );
    expect(payload).toBeDefined();

    consoleSpy.mockRestore();
  });

  it('resets to children after Try Again once the child no longer throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { rerender } = render(
      <ErrorBoundary>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );

    expect(await screen.findByText('Child exploded')).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(screen.getByText('All good')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
