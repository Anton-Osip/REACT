import clsx from 'clsx';
import {
  Component,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';
import s from './typography.module.css';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body1'
  | 'body2'
  | 'subtitle1'
  | 'subtitle2'
  | 'caption'
  | 'overline'
  | 'link1'
  | 'link2';

type TypographyElementType =
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'span'
  | 'div'
  | 'label';

export type TypographyProps<T extends ElementType = TypographyElementType> = {
  as?: T;
  children: ReactNode;
  variant?: TypographyVariant;
  className?: string;
} & ComponentPropsWithoutRef<T>;

export class Typography<
  T extends ElementType = TypographyElementType,
> extends Component<TypographyProps<T>> {
  constructor(props: TypographyProps<T>) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      variant = 'body1',
      className,
      as: Component = 'p',
      children,
      ...rest
    } = this.props;
    const Element: ElementType = Component;
    return (
      <Element className={clsx(s.typography, s[variant], className)} {...rest}>
        {children}
      </Element>
    );
  }
}
