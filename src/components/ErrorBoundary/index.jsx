// src/components/ErrorBoundary/index.jsx
import React from 'react';

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
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error('ErrorBoundary caught an error', error, errorInfo);
        this.setState({
            errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="max-w-xl p-8 bg-white rounded-lg shadow-md">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <div className="mb-4">
                            <p className="text-gray-600">We're sorry - something's gone wrong.</p>
                            <p className="text-gray-600">Our team has been notified.</p>
                        </div>
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-4">
                                <details className="cursor-pointer">
                                    <summary className="text-sm text-gray-700 mb-2">Error Details</summary>
                                    <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                                        {this.state.error && this.state.error.toString()}
                                        <br />
                                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            </div>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;