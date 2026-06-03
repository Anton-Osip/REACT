import { useContext } from 'react';

import {
  CheckboxContext,
  type CheckboxContextType,
} from './checkbox.context.ts';

export const useCheckbox = (): CheckboxContextType => {
  const context = useContext(CheckboxContext);
  if (!context) {
    throw new Error(
      'CheckboxField.* компонент должен использоваться внутри <CheckboxField>'
    );
  }
  return context;
};
