import {
  Component,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import s from './text-field.module.css';
import { Typography } from '../typography';
import clsx from 'clsx';

export type InputProps = {
  type?: 'text' | 'password';
  label?: string;
  buttonIconEnd?: ReactNode;
  buttonIconActionEnd?: () => void;
  iconStart?: ReactNode;
  isError?: boolean;
  errorText?: string;
} & ComponentPropsWithoutRef<'input'>;

export class TextField extends Component<InputProps> {
  constructor(props: InputProps) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      type = 'text',
      label,
      buttonIconEnd,
      buttonIconActionEnd,
      iconStart,
      isError,
      errorText,
      ...props
    } = this.props;

    return (
      <div>
        {label && (
          <Typography className={s.label} variant={'body2'}>
            {label}
          </Typography>
        )}
        <div className={s.inputWrapper}>
          {iconStart && <div className={s.iconStart}>{iconStart}</div>}
          <input
            type={type}
            className={clsx(
              s.input,
              buttonIconEnd && s.withButtonEnd,
              iconStart && s.withIconStart,
              isError && s.inputError
            )}
            {...props}
          />
          {buttonIconEnd && (
            <button className={s.buttonIconEnd} onClick={buttonIconActionEnd}>
              {buttonIconEnd}
            </button>
          )}
        </div>
        {errorText && (
          <Typography className={s.errorText} variant={'caption'}>
            {errorText}
          </Typography>
        )}
      </div>
    );
  }
}
