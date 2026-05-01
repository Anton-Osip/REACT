import clsx from 'clsx';
import { Component, type ComponentPropsWithoutRef } from 'react';
import s from './skeleton.module.css';

export type SkeletonProps = {
  className?: string;
} & ComponentPropsWithoutRef<'div'>;

export class Skeleton extends Component<SkeletonProps> {
  render() {
    const { className } = this.props;

    return <div className={clsx(s.skeleton, className)}></div>;
  }
}
