import React, { ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleResetAll = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) reg.unregister();
        });
      }
      if (typeof caches !== 'undefined') {
        caches.keys().then((keys) => {
          for (const key of keys) caches.delete(key);
        });
      }
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-screen w-full flex items-center justify-center bg-[#FAF9F6] p-4 font-['Tajawal',sans-serif]"
        >
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-xl border border-rose-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-slate-800">
              حدث تنبيه أثناء تحميل واجهة المنصة
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              تم اكتشاف تنبيه في المتصفح. يمكنك الضغط على الزر أدناه لإعادة تشغيل المنصة واستعادة البيانات الافتراضية فوراً.
            </p>
            {this.state.error && (
              <div className="bg-slate-50 rounded-xl p-3 text-[11px] font-mono text-slate-600 text-left overflow-auto max-h-28 border border-slate-200">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 rounded-2xl bg-[#46523B] hover:bg-[#353F2D] text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4 text-[#A08D52]" />
                <span>إعادة تحميل الصفحة الآن</span>
              </button>
              <button
                type="button"
                onClick={this.handleResetAll}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>إعادة ضبط الذاكرة المؤقتة وتشغيل المنصة</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
