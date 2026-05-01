import {
  Component,
  type ReactNode,
  type CSSProperties,
  type SVGProps,
  type HTMLProps,
} from 'react';

export type IconProps = {
  backgroundColor?: string;
  color?: string;
  size?: number;
  svgProps?: SVGProps<SVGSVGElement>;
} & Omit<HTMLProps<HTMLSpanElement>, 'color' | 'size'>;

interface IconWrapperProps extends IconProps {
  icon: ReactNode;
}

export class IconWrapper extends Component<IconWrapperProps> {
  render() {
    const {
      backgroundColor = 'var(--color-neutral-light-50)',
      color: colorProp,
      icon,
      size: sizeProp,
      ...restProps
    } = this.props;

    const color = colorProp ? colorProp : 'currentColor';
    const size = sizeProp ? `${sizeProp}px` : '24px';

    return (
      <span
        aria-hidden={'true'}
        role={'img'}
        style={
          {
            '--color-bg-icon': backgroundColor,
            color: color,
            display: 'inline-flex',
            fontSize: 'inherit',
            height: size,
            width: size,
          } as CSSProperties
        }
        {...restProps}
      >
        {icon}
      </span>
    );
  }
}
