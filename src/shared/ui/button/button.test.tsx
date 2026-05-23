import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from './button.tsx';

describe('Button', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders button with children', () => {
    render(<Button>button</Button>);

    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('button');
  });

  it('renders native button by default', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button').tagName).toBe('BUTTON');
  });

  it('renders as anchor when as="a" and passes href', () => {
    render(
      <Button as="a" href="/test">
        Link Button
      </Button>
    );

    const link = screen.getByRole('link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('calls onClick when button is activated', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders icon alongside children', () => {
    render(<Button icon={<span data-testid="btn-icon">★</span>}>Label</Button>);

    expect(screen.getByTestId('btn-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('★');
    expect(screen.getByRole('button')).toHaveTextContent('Label');
  });

  it('merges custom className onto the element', () => {
    render(<Button className="extra-class">X</Button>);
    expect(screen.getByRole('button')).toHaveClass('extra-class');
  });

  it('applies fullWidth layout class when fullWidth is set', () => {
    render(<Button fullWidth>Wide</Button>);
    expect(screen.getByRole('button').className).toMatch(/fullWidth/);
  });
});
