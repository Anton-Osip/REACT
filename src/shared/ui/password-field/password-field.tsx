import { type FC, useState } from 'react';

import { EyeIcon, EyeOffIcon } from '@/shared/ui';
import { TextField } from '@/shared/ui/text-field';
import type { TextFieldProps } from '@/shared/ui/text-field/text-field.tsx';

export type PasswordFieldProps = {
  withPasswordStrengthIndicator?: boolean;
} & Omit<TextFieldProps, 'type' | 'buttonIconEnd' | 'buttonIconActionEnd'>;

export const PasswordField: FC<PasswordFieldProps> = ({
  withPasswordStrengthIndicator = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  if (!withPasswordStrengthIndicator)
    return (
      <TextField
        {...props}
        type={showPassword ? 'text' : 'password'}
        buttonIconEnd={showPassword ? <EyeIcon /> : <EyeOffIcon />}
        buttonIconActionEnd={() => setShowPassword((prevState) => !prevState)}
      />
    );

  return (
    <div>
      <TextField
        {...props}
        type={showPassword ? 'text' : 'password'}
        buttonIconEnd={showPassword ? <EyeIcon /> : <EyeOffIcon />}
        buttonIconActionEnd={() => setShowPassword((prevState) => !prevState)}
      />
    </div>
  );
};
