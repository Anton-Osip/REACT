import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { FormUncontrolled } from './form-uncontrolled.tsx';

describe('FormUncontrolled', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders uncontrolled form placeholder content', () => {
    render(<FormUncontrolled />);

    expect(screen.getByText('UncontrolledForms')).toBeInTheDocument();
  });
});
