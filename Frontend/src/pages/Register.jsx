import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import apiClient from '../api/apiClient';

const GOOGLE_CLIENT_ID = "your_google_client_id_here";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/register', { name, email, password });
      if (res.data.accessToken) {
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('accessToken', res.data.accessToken);
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
        localStorage.setItem('accessToken', res.data.accessToken);
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.message || 'Google registration failed.');
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4">
        <div className="mb-6 flex flex-col items-center gap-3">
          <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            Create Account
          </h2>
        </div>

        <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-xl text-center flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleEmailRegister} className="space-y-4 mb-8">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-200"
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-200"
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-200"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50 mt-2"
            >
              {loading ? "Creating account..." : "Sign Up with Email"}
            </button>
          </form>

          <div className="relative flex items-center justify-center mb-8">
            <span className="w-full h-px bg-white/10 absolute inset-x-0"></span>
            <span className="relative bg-slate-900 px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Or
            </span>
          </div>

          <div className="flex justify-center items-center w-full">
            <div className="w-full flex justify-center hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
               <GoogleLogin
                 onSuccess={handleGoogleSuccess}
                 onError={() => setError('Google initialization failed.')}
                 useOneTap
                 theme="filled_black"
                 size="large"
                 shape="rectangular"
                 text="signup_with"
                 width="100%"
               />
            </div>
          </div>
          
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
