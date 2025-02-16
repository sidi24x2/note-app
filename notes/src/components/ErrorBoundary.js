import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }; // Update state to show the fallback UI
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an external service here
    console.error('Error:', error, 'Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong!</h1>; // Fallback UI
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
