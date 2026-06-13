'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

import { Image } from 'next/dist/client/image-component';

import { Button, Typography } from '@components/common';

type ErrorBoundaryProps = {
  children: ReactNode;
  onReset?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-center max-w-2/3 w-full p-4 flex flex-col items-center justify-center gap-4">
            <Typography variant="h1">Something went wrong</Typography>
            <Image src="/errorPageImage.png" alt="error message" width={528} height={528} />
            <Typography variant="h3">{this.state.error?.message || 'An unexpected error occurred'}</Typography>
            <Button variant="primary" onClick={this.handleReset} fullWidth>
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
