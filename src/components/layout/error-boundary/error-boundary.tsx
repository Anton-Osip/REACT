'use client';

import { Component, type ErrorInfo, type FC, type ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import { ErrorComponent } from '@components/layout/error';

type ErrorBoundaryProps = {
  children: ReactNode;
  onReset?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

type ErrorBoundaryFallbackProps = {
  error: Error | null;
  onReset: () => void;
};

const ErrorBoundaryFallback: FC<ErrorBoundaryFallbackProps> = ({ error, onReset }) => {
  const t = useTranslations('Error');

  return (
    <ErrorComponent
      title={t('somethingWentWrong')}
      message={error?.message ?? t('unexpectedError')}
      onAction={onReset}
    />
  );
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
      return <ErrorBoundaryFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}
