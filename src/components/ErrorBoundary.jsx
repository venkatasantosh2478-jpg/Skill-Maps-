import React from "react";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";

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
    this.setState({ errorInfo });
    console.error("SkillsMap ErrorBoundary caught an unhandled exception:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-body text-slate-800 dark:text-slate-100">
          <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6 text-center relative overflow-hidden">
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-rose-500 to-violet-500" />

            <div className="h-16 w-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                <ShieldAlert className="h-3.5 w-3.5" />
                Runtime Error Intercepted
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
                Something went wrong
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                An unexpected component error occurred. Don't worry—your progress and data remain safely preserved.
              </p>
            </div>

            {/* Technical Details Expander */}
            {this.state.error && (
              <div className="text-left bg-slate-900 text-slate-200 rounded-2xl p-4 text-xs font-mono overflow-x-auto max-h-40 custom-scrollbar border border-slate-800">
                <p className="text-rose-400 font-bold mb-1">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-3xs text-slate-400 whitespace-pre-wrap leading-tight">
                    {this.state.errorInfo.componentStack.trim().split("\n").slice(0, 4).join("\n")}
                  </pre>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
