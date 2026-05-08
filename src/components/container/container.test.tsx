import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Container } from './container.tsx';
import '@testing-library/jest-dom/vitest';

describe('Container', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render div element by default', () => {
    render(<Container>Content</Container>);

    const container = screen.getByText('Content');
    expect(container.tagName).toBe('DIV');
    expect(container).toHaveTextContent('Content');
  });

  it('should render children correctly', () => {
    render(
      <Container>
        <span>Child 1</span>
        <span>Child 2</span>
      </Container>
    );

    const child1 = screen.getByText('Child 1');
    const child2 = screen.getByText('Child 2');

    expect(child1).toBeInTheDocument();
    expect(child1).toHaveTextContent('Child 1');
    expect(child2).toBeInTheDocument();
    expect(child2).toHaveTextContent('Child 2');
  });
});
