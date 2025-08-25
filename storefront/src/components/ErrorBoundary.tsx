import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@medusajs/ui'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="content-container py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-ui-fg-base mb-4">
              Something went wrong
            </h2>
            <p className="text-ui-fg-muted mb-6">
              We encountered an error while loading this page. Please try again.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
            >
              Reload page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary