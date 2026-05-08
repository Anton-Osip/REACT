import clsx from 'clsx';
import {
  Component,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';
import s from './button.module.css';

export type ButtonProps<T extends ElementType = 'button' | 'a'> = {
  as?: T;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  className?: string;
  icon?: ReactNode;
} & ComponentPropsWithoutRef<T>;

export class Button<T extends ElementType = 'button' | 'a'> extends Component<
  ButtonProps<T>
> {
  constructor(props: ButtonProps<T>) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      variant = 'primary',
      fullWidth,
      className,
      as: Component = 'button',
      icon,
      children,
      ...rest
    } = this.props;

    const Element = Component as ElementType;

    return (
      <Element
        className={clsx(
          s.button,
          s[variant],
          icon && s.withIcon,
          fullWidth && s.fullWidth,
          className
        )}
        {...rest}
      >
        {icon && icon}
        {children}
      </Element>
    );
  }
}
