import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Typography } from './typography';

describe('Typography', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children correctly', () => {
    render(<Typography>Hello World</Typography>);
    const text = screen.getByText('Hello World');
    expect(text).toBeInTheDocument();
  });

  it('renders as p tag by default', () => {
    render(<Typography>Paragraph text</Typography>);
    const element = screen.getByText('Paragraph text');
    expect(element.tagName).toBe('P');
  });

  it('renders as specified HTML element', () => {
    render(
      <>
        <Typography as="h1">Heading 1</Typography>
        <Typography as="span">Span text</Typography>
        <Typography as="div">Div text</Typography>
        <Typography as="label">Label text</Typography>
      </>
    );

    expect(screen.getByText('Heading 1').tagName).toBe('H1');
    expect(screen.getByText('Span text').tagName).toBe('SPAN');
    expect(screen.getByText('Div text').tagName).toBe('DIV');
    expect(screen.getByText('Label text').tagName).toBe('LABEL');
  });

  it('passes through additional DOM attributes', () => {
    render(
      <Typography
        id="my-text"
        data-testid="typography-element"
        aria-label="Important text"
        title="Tooltip text"
      >
        Attributed text
      </Typography>
    );

    const element = screen.getByTestId('typography-element');
    expect(element).toHaveAttribute('id', 'my-text');
    expect(element).toHaveAttribute('aria-label', 'Important text');
    expect(element).toHaveAttribute('title', 'Tooltip text');
  });

  it('renders heading levels correctly', () => {
    render(
      <>
        <Typography as="h1" variant="h1">
          Main Title
        </Typography>
        <Typography as="h2" variant="h2">
          Section Title
        </Typography>
        <Typography as="h3" variant="h3">
          Subsection Title
        </Typography>
      </>
    );

    const h1 = screen.getByText('Main Title');
    const h2 = screen.getByText('Section Title');
    const h3 = screen.getByText('Subsection Title');

    expect(h1.tagName).toBe('H1');
    expect(h2.tagName).toBe('H2');
    expect(h3.tagName).toBe('H3');
  });
});
