import { createContext } from 'react';

export const CHECKBOX_INDETERMINATE = 'indeterminate' as const;

export type CheckboxCheckedState = boolean | typeof CHECKBOX_INDETERMINATE;

export type CheckboxContextType = {
  checked: CheckboxCheckedState;
  onCheckedChange: (checked: boolean) => void;
  id: string;
};

export const isCheckboxIndeterminate = (
  checked: CheckboxCheckedState
): checked is typeof CHECKBOX_INDETERMINATE =>
  checked === CHECKBOX_INDETERMINATE;

export const CheckboxContext = createContext<CheckboxContextType | undefined>(
  undefined
);
