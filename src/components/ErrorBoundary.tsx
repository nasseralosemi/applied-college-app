import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (Component as any) {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4 font-['Tajawal',sans-serif]">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-200 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {this.props.fallbackTitle || 'حدث تنبيه أثناء معالجة بيانات الصفحة'}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                تم استعادة حماية النظام بنجاح دون فقدان البيانات. اضغط على الزر أدناه لتحديث العرض والمتابعة بسلاسة.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-600 text-left ltr truncate">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b4332] text-[#e6c566] text-xs font-black shadow-lg shadow-[#1b4332]/20 active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تحديث العرض</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
