import { type FC } from 'react';
import { type IconProps, IconWrapper } from '../../IconWrapper.tsx';

type Props = IconProps;

export const SearchIcon: FC<Props> = ({ svgProps: props, ...restProps }) => {
  return (
    <IconWrapper
      icon={
        <svg
          width="17"
          height="17"
          viewBox="0 0 17 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M7.41667 14.0833C11.0986 14.0833 14.0833 11.0986 14.0833 7.41667C14.0833 3.73477 11.0986 0.75 7.41667 0.75C3.73477 0.75 0.75 3.73477 0.75 7.41667C0.75 11.0986 3.73477 14.0833 7.41667 14.0833Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.7505 15.7498L12.1255 12.1248"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      }
      backgroundColor={restProps.backgroundColor}
      color={restProps.color}
      size={restProps.size}
    />
  );
};
