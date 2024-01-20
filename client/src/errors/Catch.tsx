import React from 'react'
import { useTranslation } from 'react-i18next'
import Log from '../log'

class ErrorBoundary extends React.Component<{
  fallback?: React.ReactNode
  defaultFallback: string
  children: React.ReactNode
}> {
  state = { hasErrors: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    Log.error(
      {
        err: error,
        info: errorInfo,
      },
      'Boundary caught an error',
    )
  }

  render() {
    if (this.state.hasErrors) {
      return this.props.fallback || <h2>{this.props.defaultFallback} </h2>
    }

    return this.props.children
  }
}

export default (props: any) => {
  const { t: translations } = useTranslation()

  return (
    <ErrorBoundary
      defaultFallback={translations('page.error.general-fallback')}
      {...props}
    />
  )
}
