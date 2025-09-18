import { Component, ErrorInfo, ReactNode } from "react";
import { terminal } from "virtual:terminal";
import ErrorFallback from "@/components/error-fallback";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      terminal.log("ErrorBoundary caught an error:", {
        ...this.state.error,
        errorMessage: this.state.error.message,
        errorStackTrace: this.state.error.stack,
      });

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
