import React from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            fontFamily: 'system-ui, sans-serif',
            maxWidth: 560,
            margin: '40px auto',
          }}
        >
          <h1 style={{ color: '#dc2626', marginBottom: 16 }}>
            Erro ao carregar o app
          </h1>
          <pre
            style={{
              background: '#f1f5f9',
              padding: 16,
              borderRadius: 8,
              overflow: 'auto',
              fontSize: 14,
            }}
          >
            {this.state.error.message}
          </pre>
          <p style={{ color: '#64748b', marginTop: 16 }}>
            Abra o Console (F12) para mais detalhes.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
