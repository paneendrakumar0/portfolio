import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 rounded-2xl bg-slate-900/80 border border-red-500/30 text-white backdrop-blur-md shadow-2xl max-w-lg mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-4 border border-red-500/20">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold font-mono tracking-wider text-red-400 mb-2">SYSTEM ANOMALY DETECTED</h3>
          <p className="text-slate-300 text-sm text-center mb-6 max-w-md">
            A rendering module or 3D viewport encountered an unexpected exception.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-mono text-sm transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            REBOOT MODULE
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
