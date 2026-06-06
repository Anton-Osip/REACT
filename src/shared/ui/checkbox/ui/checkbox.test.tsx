import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Checkbox } from './checkbox.tsx';

const defaultProps = {
  id: 'terms-checkbox',
  checked: false as boolean | 'indeterminate',
  onCheckedChange: vi.fn(),
};

const renderCheckbox = (
  props: Partial<typeof defaultProps> & { className?: string } = {}
) => {
  const mergedProps = { ...defaultProps, ...props };

  return render(
    <Checkbox
      id={mergedProps.id}
      checked={mergedProps.checked}
      onCheckedChange={mergedProps.onCheckedChange}
      className={props.className}
    >
      <Checkbox.Indicator />
      <Checkbox.Label>Accept terms</Checkbox.Label>
    </Checkbox>
  );
};

describe('CheckboxField', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders checkbox input and label', () => {
    renderCheckbox();

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('associates label with input via id and htmlFor', () => {
    renderCheckbox({ id: 'agreement' });

    const input = screen.getByRole('checkbox');
    const label = screen.getByText('Accept terms');

    expect(input).toHaveAttribute('id', 'agreement');
    expect(label).toHaveAttribute('for', 'agreement');
  });

  it('reflects checked state', () => {
    const { rerender } = render(
      <Checkbox id="terms-checkbox" checked={false} onCheckedChange={vi.fn()}>
        <Checkbox.Indicator />
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox>
    );

    expect(screen.getByRole('checkbox')).not.toBeChecked();

    rerender(
      <Checkbox id="terms-checkbox" checked={true} onCheckedChange={vi.fn()}>
        <Checkbox.Indicator />
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox>
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('sets indeterminate state on the native input', () => {
    renderCheckbox({ checked: 'indeterminate' });

    const input = screen.getByRole('checkbox') as HTMLInputElement;

    expect(input.indeterminate).toBe(true);
    expect(input).not.toBeChecked();
  });

  it('calls onCheckedChange when checkbox is toggled', () => {
    const onCheckedChange = vi.fn();
    renderCheckbox({ onCheckedChange });

    fireEvent.click(screen.getByRole('checkbox'));

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('merges custom className onto the root element', () => {
    const { container } = renderCheckbox({ className: 'extra-class' });

    expect(container.firstChild).toHaveClass('extra-class');
  });

  it('merges custom className onto Indicator and Label', () => {
    render(
      <Checkbox id="terms-checkbox" checked={false} onCheckedChange={vi.fn()}>
        <Checkbox.Indicator className="indicator-class" />
        <Checkbox.Label className="label-class">Accept terms</Checkbox.Label>
      </Checkbox>
    );

    expect(screen.getByText('Accept terms')).toHaveClass('label-class');
    expect(document.querySelector('.indicator-class')).toBeInTheDocument();
  });
});
