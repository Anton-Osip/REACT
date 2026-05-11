import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { IconWrapper } from './IconWrapper';

describe('IconWrapper', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders icon children', () => {
    render(
      <IconWrapper icon={<svg data-testid="inner-svg" aria-label="icon" />} />
    );

    expect(screen.getByTestId('inner-svg')).toBeInTheDocument();
  });

  it('uses default size when size prop is omitted', () => {
    render(<IconWrapper icon={<svg />} />);
    const wrapper = screen.getByRole('img', { hidden: true });

    expect(wrapper).toHaveStyle({ height: '24px', width: '24px' });
  });

  it('applies numeric size as pixels', () => {
    render(<IconWrapper icon={<svg />} size={40} />);
    const wrapper = screen.getByRole('img', { hidden: true });

    expect(wrapper).toHaveStyle({ height: '40px', width: '40px' });
  });

  it('applies custom color', () => {
    render(<IconWrapper icon={<svg />} color="red" />);
    const wrapper = screen.getByRole('img', { hidden: true });

    expect(wrapper).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('applies custom backgroundColor CSS variable', () => {
    render(
      <IconWrapper icon={<svg />} backgroundColor="rgb(0, 128, 0)" size={16} />
    );
    const wrapper = screen.getByRole('img', { hidden: true });

    expect(wrapper).toHaveStyle({ '--color-bg-icon': 'rgb(0, 128, 0)' });
  });

  it('forwards extra span props', () => {
    render(
      <IconWrapper
        icon={<svg />}
        data-testid="icon-shell"
        title="Search"
        className="toolbar-icon"
      />
    );

    const shell = screen.getByTestId('icon-shell');
    expect(shell).toHaveAttribute('title', 'Search');
    expect(shell).toHaveClass('toolbar-icon');
  });
});
