import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { IconWrapper } from './IconWrapper.tsx';

describe('IconWrapper', () => {
  afterEach(() => {
    cleanup();
  });

  it('applies custom color and size', () => {
    render(<IconWrapper icon={<svg />} color="red" size={40} />);
    const wrapper = screen.getByRole('img', { hidden: true });

    expect(wrapper).toHaveStyle({
      color: 'rgb(255, 0, 0)',
      height: '40px',
      width: '40px',
    });
  });
});
