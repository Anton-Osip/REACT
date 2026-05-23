import { Component, type ErrorInfo, type ReactNode } from 'react';

import { Button, Typography } from '@/shared/ui';

import errorPageImage from '../../assets/image/errorPageImage.png';

import s from './error-boundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.props.onReset?.();
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className={s.errorBoundary}>
          <div className={s.errorContent}>
            <Typography variant="h2" className={s.errorTitle}>
              Something went wrong
            </Typography>
            <img
              className={s.errorPageImage}
              src={errorPageImage}
              alt="error image"
            />
            <Typography variant="body2" className={s.errorMessage}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            <Button
              variant="secondary"
              onClick={this.handleReset}
              className={s.resetButton}
              fullWidth
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
