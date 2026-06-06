import React, { type ComponentPropsWithoutRef, type FC, useState } from 'react';

import { RadioGroupProvider } from '@/shared/ui/radio-group/model';
import { RadioItem } from '@/shared/ui/radio-group/ui/radio.tsx';

type Props = {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: ComponentPropsWithoutRef<'input'>['onBlur'];
  children: React.ReactNode;
  className?: string;
};

export const RadioGroup: FC<Props> & {
  Item: typeof RadioItem;
} = ({
  name,
  value,
  defaultValue = '',
  onChange,
  onBlur,
  children,
  className = '',
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : uncontrolledValue;

  const handleChange = (nextValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <RadioGroupProvider
      value={{ name, selectedValue, onChange: handleChange, onBlur }}
    >
      <div role="radiogroup" className={className}>
        {children}
      </div>
    </RadioGroupProvider>
  );
};

RadioGroup.Item = RadioItem;
