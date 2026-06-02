import React, { type FC, useState } from 'react';

import { RadioGroupProvider } from '@/shared/ui/radio-group/model';
import { RadioItem } from '@/shared/ui/radio-group/ui/radio.tsx';

type Props = {
  name: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
};

export const RadioGroup: FC<Props> & {
  Item: typeof RadioItem;
} = ({ name, defaultValue = '', onChange, children, className = '' }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  return (
    <RadioGroupProvider value={{ name, selectedValue, onChange: handleChange }}>
      <div role="radiogroup" className={className}>
        {children}
      </div>
    </RadioGroupProvider>
  );
};

RadioGroup.Item = RadioItem;
