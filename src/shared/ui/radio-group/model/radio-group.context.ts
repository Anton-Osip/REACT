import { createContext, useContext } from 'react';

interface RadioGroupContextValue {
  name: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const useRadioGroup = () => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('Radio компонент должен использоваться внутри RadioGroup');
  }
  return context;
};

export const RadioGroupProvider = RadioGroupContext.Provider;
