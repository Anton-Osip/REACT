import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { EmptyComponent } from './empty';

describe('EmptyComponent', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders nothing when isEmpty is false', () => {
    const { container } = render(<EmptyComponent isEmpty={false} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when isEmpty is null', () => {
    const { container } = render(<EmptyComponent isEmpty={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when isEmpty is undefined', () => {
    const { container } = render(<EmptyComponent />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders empty UI when isEmpty is true', () => {
    render(<EmptyComponent isEmpty={true} />);

    expect(
      screen.getByRole('img', { name: /empty page/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Nothing found.')).toBeInTheDocument();
  });

  it('shows default message when emptyText is not provided', () => {
    render(<EmptyComponent isEmpty={true} />);

    expect(screen.getByText('Nothing found.')).toBeInTheDocument();
  });

  it('shows custom message when emptyText is provided', () => {
    render(
      <EmptyComponent
        isEmpty={true}
        emptyText="No characters match your search"
      />
    );

    expect(
      screen.getByText('No characters match your search')
    ).toBeInTheDocument();
    expect(screen.queryByText('Nothing found.')).not.toBeInTheDocument();
  });

  it('merges custom className onto the root element', () => {
    const { container } = render(
      <EmptyComponent isEmpty={true} className="custom-empty" />
    );

    expect(container.firstElementChild).toHaveClass('custom-empty');
  });
});
