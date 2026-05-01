import clsx from 'clsx';
import {
  Component,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import s from './container.module.css';

export type ContainerProps = {
  children: ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<'div'>;

export class Container extends Component<ContainerProps> {
  constructor(props: ContainerProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { className, children, ...rest } = this.props;

    return (
      <div className={clsx(s.container, className)} {...rest}>
        {children}
      </div>
    );
  }
}
