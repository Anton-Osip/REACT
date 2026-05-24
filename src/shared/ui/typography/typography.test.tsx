import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Typography } from './typography.tsx';

describe('Typography', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children', () => {
    render(<Typography>Hello World</Typography>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('uses paragraph element by default', () => {
    render(<Typography>Paragraph text</Typography>);
    expect(screen.getByText('Paragraph text').tagName).toBe('P');
  });

  it('renders requested polymorphic elements', () => {
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

  it('merges className onto the element', () => {
    render(
      <Typography className="muted-copy" data-testid="typo">
        Styled
      </Typography>
    );

    expect(screen.getByTestId('typo')).toHaveClass('muted-copy');
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

  it('renders heading tags when as matches heading level', () => {
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

    expect(screen.getByText('Main Title').tagName).toBe('H1');
    expect(screen.getByText('Section Title').tagName).toBe('H2');
    expect(screen.getByText('Subsection Title').tagName).toBe('H3');
  });
});
