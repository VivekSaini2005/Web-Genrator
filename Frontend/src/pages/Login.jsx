import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import apiClient from '../api/apiClient';
import { Zap, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your_google_client_id_here";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data.accessToken) {
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('accessToken', res.data.accessToken);
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError('');
      setLoading(true);
      const res = await apiClient.post('/auth/google', { 
        idToken: credentialResponse.credential 
      });
      if (res.data.accessToken) {
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('accessToken', res.data.accessToken);
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.message || 'Google login verification failed.');
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 transition-colors duration-300">
        
        {/* Branding */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
            <Zap size={28} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">WebGen</h1>
        </div>

        {/* Card */}
        <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all">
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Welcome back</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to your workspace to continue.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
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
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Password</label>
                <Link to="/forgot-password" size={18} className="text-xs font-bold text-slate-900 dark:text-white hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 focus:border-slate-300 dark:focus:border-white/20 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-slate-900/10 dark:shadow-none mt-2"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8 h-px bg-slate-100 dark:bg-white/5">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
              Or continue with
            </span>
          </div>

          <div className="space-y-4">
             <div className="w-full flex justify-center transform scale-105">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google initialization failed.')}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  width="100%"
                />
             </div>

             <div className="pt-4 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-bold text-slate-900 dark:text-white hover:underline transition-all">
                    Create account
                  </Link>
                </p>
             </div>
          </div>
        </div>

        {/* Dynamic Footer Info */}
        <p className="mt-8 text-xs text-slate-400 dark:text-slate-500 font-medium tracking-tight">
          © 2026 WebGen. All rights reserved.
        </p>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;