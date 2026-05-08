import { describe, expect, it, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Button } from './button.tsx';
import '@testing-library/jest-dom/vitest';

describe('Button', () => {
  afterEach(() => {
    cleanup();
  });
  it('should render button with children when children is provided', () => {
    render(<Button>button</Button>);

    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('button');
  });
  it('should render button as button element by default', () => {
    render(<Button>Click me</Button>);

    const btn = screen.getByRole('button');
    expect(btn.tagName).toBe('BUTTON');
  });
  it('should render custom element when "as" prop is provided', () => {
    render(
      <Button as="a" href="/test">
        Link Button
      </Button>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should handle onClick events', () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    button.click();
    expect(clicked).toBe(true);
  });
});
