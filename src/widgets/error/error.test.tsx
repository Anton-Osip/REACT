import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ErrorComponent } from './error.tsx';

describe('ErrorComponent', () => {
  const user = userEvent.setup();
  const tryAgain = vi.fn();

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders nothing when isError is false', () => {
    const { container } = render(
      <ErrorComponent isError={false} tryAgain={tryAgain} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when isError is null', () => {
    const { container } = render(
      <ErrorComponent isError={null} tryAgain={tryAgain} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders error UI when isError is true', () => {
    render(<ErrorComponent isError={true} tryAgain={tryAgain} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: /error image/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
  });

  it('shows default error message when errorText is not provided', () => {
    render(<ErrorComponent isError={true} tryAgain={tryAgain} />);

    expect(
      screen.getByText('An unexpected error occurred')
    ).toBeInTheDocument();
  });

  it('shows custom error message when errorText is provided', () => {
    render(
      <ErrorComponent
        isError={true}
        errorText="Failed to load characters"
        tryAgain={tryAgain}
      />
    );

    expect(screen.getByText('Failed to load characters')).toBeInTheDocument();
    expect(
      screen.queryByText('An unexpected error occurred')
    ).not.toBeInTheDocument();
  });

  it('calls tryAgain when Try Again button is clicked', async () => {
    render(<ErrorComponent isError={true} tryAgain={tryAgain} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(tryAgain).toHaveBeenCalledTimes(1);
  });

  it('merges custom className onto the root element', () => {
    const { container } = render(
      <ErrorComponent
        isError={true}
        tryAgain={tryAgain}
        className="custom-error"
      />
    );

    expect(container.firstElementChild).toHaveClass('custom-error');
  });
});
