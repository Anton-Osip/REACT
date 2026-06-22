'use client';

import { type ReactNode, type CSSProperties, type SVGProps, type HTMLProps, type FC } from 'react';

export type IconProps = {
  backgroundColor?: string;
  color?: string;
  size?: number;
  svgProps?: SVGProps<SVGSVGElement>;
} & Omit<HTMLProps<HTMLSpanElement>, 'color' | 'size'>;

type IconWrapperProps = IconProps & {
  icon: ReactNode;
};

export const IconWrapper: FC<IconWrapperProps> = ({
  backgroundColor = 'var(--background)',
  color: colorProp,
  icon,
  size: sizeProp,
  ...restProps
}) => {
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
};
