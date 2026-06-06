import { type FC, type SVGProps } from 'react';

import { type IconProps, IconWrapper } from '../../IconWrapper.tsx';

type Props = IconProps;

export const CheckIconSvg: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.91667 7.58333L5.83333 10.5L11.0833 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CheckIcon: FC<Props> = ({ svgProps: props, ...restProps }) => {
  return (
    <IconWrapper
      icon={<CheckIconSvg width="14" height="14" {...props} />}
      backgroundColor={restProps.backgroundColor}
      color={restProps.color}
      size={restProps.size}
    />
  );
};
