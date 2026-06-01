import { useContext } from 'react';

import {
  CheckboxContext,
  type CheckboxContextType,
} from './checkbox.context.ts';

export const useCheckbox = (): CheckboxContextType => {
  const context = useContext(CheckboxContext);
  if (!context) {
    throw new Error(
      'Checkbox.* компонент должен использоваться внутри <Checkbox>'
    );
  }
  return context;
};
