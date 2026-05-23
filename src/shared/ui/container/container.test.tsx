import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Container } from './container.tsx';

describe('Container', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a div with children', () => {
    render(<Container>Content</Container>);

    const el = screen.getByText('Content');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveTextContent('Content');
  });

  it('renders multiple children', () => {
    render(
      <Container>
        <span>Child 1</span>
        <span>Child 2</span>
      </Container>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('merges className onto the root div', () => {
    const { container } = render(
      <Container className="layout-root">Inner</Container>
    );

    const root = container.firstElementChild;
    expect(root).toHaveClass('layout-root');
  });

  it('forwards native div attributes', () => {
    render(
      <Container data-testid="page-shell" role="presentation">
        Body
      </Container>
    );

    const shell = screen.getByTestId('page-shell');
    expect(shell).toHaveAttribute('role', 'presentation');
    expect(shell).toHaveTextContent('Body');
  });
});
