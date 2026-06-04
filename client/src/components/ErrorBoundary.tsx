import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            padding: '2rem',
            gap: '1rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '2rem' }} aria-hidden>⚠️</p>
          <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Something went wrong</p>
          {this.state.error && (
            <p style={{ color: '#888', fontSize: '0.875rem', maxWidth: '480px' }}>
              {this.state.error.message}
            </p>
          )}
          <button
            onClick={this.handleReset}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1.25rem',
              borderRadius: '0.375rem',
              border: '1px solid currentColor',
              cursor: 'pointer',
              background: 'transparent',
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
