import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Zap, Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      setStatus({ type: 'success', message: res.data.message });
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.error || err.message || "Something went wrong." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 transition-colors duration-300">
      
      {/* Branding */}
      <Link to="/" className="mb-8 flex flex-col items-center gap-2 group">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
          <Zap size={28} fill="currentColor" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">WebGen</h1>
      </Link>

      {/* Card */}
      <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all">
        
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Reset password</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 px-4">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        {status.message && (
          <div className={`mb-6 p-4 border rounded-2xl flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2 ${
            status.type === 'error' 
              ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400' 
              : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
          }`}>
            {status.type === 'error' ? (
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Email address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={18} />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 focus:border-slate-300 dark:focus:border-white/20 transition-all font-medium"
                required
                disabled={loading || status.type === 'success'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || status.type === 'success'}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-slate-900/10 dark:shadow-none"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <span>Send Reset Link</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:opacity-70 transition-all">
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-400 dark:text-slate-500 font-medium tracking-tight">
        Protected by WebGen Secure.
      </p>
    </div>
  );
};

export default ForgotPassword;