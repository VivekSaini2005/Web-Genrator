import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import apiClient from '../api/apiClient';
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your_google_client_id_here";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/register', { name, email, password });
      if (res.data.accessToken) {
        localStorage.setItem('token', res.data.accessToken);
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to register.");
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
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.message || 'Google registration failed.');
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto flex items-center justify-center px-3 sm:px-6 md:px-8 py-5 sm:py-6 bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 transition-colors duration-300">
        <div className="w-[90%] sm:w-full max-w-[400px] my-auto">
          <div className="w-full max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden flex flex-col items-center bg-[rgba(255,255,255,0.08)] dark:bg-[rgba(255,255,255,0.08)] backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-8 shadow-xl shadow-black/15 transition-all animate-[authCardEnter_420ms_cubic-bezier(0.16,1,0.3,1)_both]">
            <Link to="/" className="mb-6 flex flex-col items-center gap-2 group text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-2xl">
                <Zap size={28} fill="currentColor" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">WebGen</h1>
            </Link>
          
            <div className="mb-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">Welcome Back</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Join WebGen to start generating.</p>
            </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

            <form onSubmit={handleEmailRegister} className="w-full space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 pl-11 bg-white/60 dark:bg-slate-800/40 border border-slate-300/70 dark:border-slate-600/60 rounded-lg text-base sm:text-sm text-slate-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-2 focus:border-indigo-500 dark:focus:border-blue-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.18)] dark:focus:shadow-[0_0_0_4px_rgba(96,165,250,0.2)] focus:animate-[inputGlowPulse_260ms_ease-out] transition-all duration-200 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 pl-11 bg-white/60 dark:bg-slate-800/40 border border-slate-300/70 dark:border-slate-600/60 rounded-lg text-base sm:text-sm text-slate-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-2 focus:border-indigo-500 dark:focus:border-blue-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.18)] dark:focus:shadow-[0_0_0_4px_rgba(96,165,250,0.2)] focus:animate-[inputGlowPulse_260ms_ease-out] transition-all duration-200 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pl-11 pr-11 bg-white/60 dark:bg-slate-800/40 border border-slate-300/70 dark:border-slate-600/60 rounded-lg text-base sm:text-sm text-slate-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-2 focus:border-indigo-500 dark:focus:border-blue-400 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.18)] dark:focus:shadow-[0_0_0_4px_rgba(96,165,250,0.2)] focus:animate-[inputGlowPulse_260ms_ease-out] transition-all duration-200 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-linear-to-r from-purple-500 to-indigo-500 text-white font-bold transform-gpu hover:scale-[1.04] hover:from-purple-400 hover:to-indigo-400 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:from-purple-500 disabled:hover:to-indigo-500 shadow-lg shadow-indigo-500/25 mt-2"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="w-full my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/20" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.16em] whitespace-nowrap">
                OR CONTINUE WITH
              </span>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            <div className="w-full space-y-4 text-center">
              <div className="w-full rounded-lg transition-transform duration-300 hover:scale-[1.01] overflow-hidden flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google initialization failed.')}
                    useOneTap
                    theme="outline"
                    shape="rectangular"
                    size="large"
                    width="100%"
                    text="continue_with"
                  />
              </div>

              <div className="pt-4 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-slate-900 dark:text-white hover:underline transition-all">
                      Sign in
                    </Link>
                  </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;