import { type FC } from 'react';
import { type IconProps, IconWrapper } from '../../IconWrapper.tsx';

type Props = IconProps;

export const MoonIcon: FC<Props> = ({ svgProps: props, ...restProps }) => {
  return (
    <IconWrapper
      icon={
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      }
      backgroundColor={restProps.backgroundColor}
      color={restProps.color}
      size={restProps.size}
    />
  );
};
