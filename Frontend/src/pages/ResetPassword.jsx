import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { KeyRound, Lock, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import apiClient from '../api/apiClient';

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (password !== confirmPassword) {
      return setStatus({ type: 'error', message: "Passwords do not match." });
    }

    if (password.length < 6) {
      return setStatus({ type: 'error', message: "Password must be at least 6 characters." });
    }

    setLoading(true);

    try {
      const res = await apiClient.post(`/auth/reset-password/${id}/${token}`, { newPassword: password });
      setStatus({ type: 'success', message: res.data.message });
      
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
      
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.error || err.message || "Failed to reset password." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 py-12 text-slate-900 dark:text-slate-100 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-xl z-10 p-8">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 shadow-inner">
            <KeyRound strokeWidth={2.5} size={28} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Set new password</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        {status.message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
            status.type === 'error' 
              ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20' 
              : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
          }`}>
            {status.type === 'error' ? <AlertCircle size={18} className="shrink-0" /> : <CheckCircle2 size={18} className="shrink-0" />}
            <p>{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                New Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm placeholder:text-gray-400 disabled:opacity-50"
                  disabled={loading || status.type === 'success'}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 px-4 py-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm placeholder:text-gray-400 disabled:opacity-50"
                  disabled={loading || status.type === 'success'}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || status.type === 'success'}
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Resetting Password...</span>
              </>
            ) : status.type === 'success' ? (
              <>
                <CheckCircle2 size={18} />
                <span>Redirecting...</span>
              </>
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft size={16} />
            Back to log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
