import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RadioGroup } from './radio-group.tsx';

const renderRadioGroup = (
  props: {
    name?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    className?: string;
    itemClassName?: string;
    disabledValue?: string;
  } = {}
) => {
  const onChange = props.onChange ?? vi.fn();

  return {
    onChange,
    ...render(
      <RadioGroup
        name={props.name ?? 'plan'}
        defaultValue={props.defaultValue ?? 'basic'}
        onChange={onChange}
        className={props.className}
      >
        <RadioGroup.Item value="basic">Basic</RadioGroup.Item>
        <RadioGroup.Item
          value="pro"
          className={props.itemClassName}
          disabled={props.disabledValue === 'pro'}
        >
          Pro
        </RadioGroup.Item>
      </RadioGroup>
    ),
  };
};

describe('RadioGroup', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders radiogroup with radio options and labels', () => {
    renderRadioGroup();

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('selects defaultValue on mount', () => {
    renderRadioGroup({ defaultValue: 'pro' });

    expect(screen.getByLabelText('Pro')).toBeChecked();
    expect(screen.getByLabelText('Basic')).not.toBeChecked();
  });

  it('changes selection when another option is clicked', () => {
    renderRadioGroup({ defaultValue: 'basic' });

    fireEvent.click(screen.getByLabelText('Pro'));

    expect(screen.getByLabelText('Pro')).toBeChecked();
    expect(screen.getByLabelText('Basic')).not.toBeChecked();
  });

  it('calls onChange with the selected value', () => {
    const { onChange } = renderRadioGroup({ defaultValue: 'basic' });

    fireEvent.click(screen.getByLabelText('Pro'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('pro');
  });

  it('assigns the same name to all radio inputs', () => {
    renderRadioGroup({ name: 'subscription' });

    screen.getAllByRole('radio').forEach((radio) => {
      expect(radio).toHaveAttribute('name', 'subscription');
    });
  });

  it('does not select a disabled option', async () => {
    const user = userEvent.setup();
    const { onChange } = renderRadioGroup({
      defaultValue: 'basic',
      disabledValue: 'pro',
    });

    await user.click(screen.getByText('Pro'));

    expect(screen.getByLabelText('Basic')).toBeChecked();
    expect(screen.getByLabelText('Pro')).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('marks disabled radio input as disabled', () => {
    renderRadioGroup({ disabledValue: 'pro' });

    expect(screen.getByLabelText('Pro')).toBeDisabled();
  });

  it('merges custom className onto the radiogroup root', () => {
    renderRadioGroup({ className: 'group-class' });

    expect(screen.getByRole('radiogroup')).toHaveClass('group-class');
  });

  it('merges custom className onto RadioGroup.Item', () => {
    renderRadioGroup({ itemClassName: 'item-class' });

    expect(screen.getByText('Pro').closest('label')).toHaveClass('item-class');
  });
});
