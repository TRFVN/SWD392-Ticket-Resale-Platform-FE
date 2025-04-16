import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="flex flex-col items-center text-center">
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-orange-500 mb-4"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We're sorry, but there was an error loading this page.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button 
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm flex-1"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </button>
                <Link 
                  to="/"
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-center flex-1 flex items-center justify-center"
                >
                  Go to Home
                </Link>
              </div>
              
              {/* Only show detailed error in development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 text-left w-full">
                  <details className="w-full">
                    <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer mb-2">
                      Error details (for developers)
                    </summary>
                    <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-auto text-xs">
                      <p className="font-mono mb-2">{this.state.error && this.state.error.toString()}</p>
                      {this.state.errorInfo && (
                        <pre className="font-mono whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      )}
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;