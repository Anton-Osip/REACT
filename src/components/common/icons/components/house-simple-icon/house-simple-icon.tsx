'use client';

import { type FC } from 'react';

import { IconProps, IconWrapper } from '@components/common';

type Props = IconProps;

export const HouseSimpleIcon: FC<Props> = ({ svgProps: props, ...restProps }) => {
  return (
    <IconWrapper
      icon={
        <svg viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
          <path
            d="M35.0306 14.9537L20.0306 0.801186C20.0233 0.794789 20.0164 0.787898 20.01 0.780561C19.4577 0.278311 18.7381 0 17.9916 0C17.2451 0 16.5254 0.278311 15.9731 0.780561L15.9525 0.801186L0.969375 14.9537C0.663746 15.2347 0.419782 15.5761 0.252922 15.9563C0.086061 16.3365 -6.30803e-05 16.7472 3.46647e-08 17.1624V34.4968C3.46647e-08 35.2925 0.31607 36.0555 0.87868 36.6181C1.44129 37.1807 2.20435 37.4968 3 37.4968H33C33.7957 37.4968 34.5587 37.1807 35.1213 36.6181C35.6839 36.0555 36 35.2925 36 34.4968V17.1624C36.0001 16.7472 35.9139 16.3365 35.7471 15.9563C35.5802 15.5761 35.3363 15.2347 35.0306 14.9537ZM33 34.4968H3V17.1624L3.02063 17.1437L18 2.99681L32.9812 17.1399L33.0019 17.1587L33 34.4968Z"
            fill="currentColor"
          />
        </svg>
      }
      backgroundColor={restProps.backgroundColor}
      color={restProps.color}
      size={restProps.size}
    />
  );
};
