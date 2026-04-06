import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import apiClient from '../api/apiClient';

// Using the same placeholder variable defined in the backend .env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your_google_client_id_here";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Standard Email Login fallback
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data.accessToken) {
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('accessToken', res.data.accessToken);
        // Full page redirect to natively reload React Context automatically
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Success Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError('');
      setLoading(true);
      
      // 1. Call backend Google auth endpoint
      const res = await apiClient.post('/auth/google', { 
        idToken: credentialResponse.credential 
      });
      
      // 2. Handle token response & store token
      if (res.data.accessToken) {
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('accessToken', res.data.accessToken);
        
        // 3. Redirect to app home
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.message || 'Google login verification failed.');
      setLoading(false);
    }
  };

  return (
    // Only wrapping the Login page to isolate OAuth logic per instruction
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen w-full flex items-center justify-center bg-bg px-6 py-12 selection:bg-primary/30">
        <div className="card w-full max-w-md">
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0 transition-transform duration-300 hover:scale-105">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
               <h2 className="text-lg font-semibold text-text-primary leading-none mb-1">Welcome back</h2>
               <p className="text-xs text-text-secondary opacity-60">Sign in to continue to LinearGen</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-400/10 border border-red-400/20 text-red-400 text-sm p-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col gap-4">
               <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] ml-1 opacity-50">Email</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                    disabled={loading}
                  />
               </div>
               <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                     <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] opacity-50">Password</label>
                     <Link to="/forgot-password" title="Reset Password" className="text-[10px] text-primary hover:opacity-80 transition-all font-bold uppercase tracking-widest">
                        Forgot?
                     </Link>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                    disabled={loading}
                  />
               </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Verifying...</span>
                </div>
              ) : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-8">
            <div className="w-full h-px bg-border/50"></div>
            <span className="absolute bg-surface/50 px-4 text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] opacity-30">
              Third Party Login
            </span>
          </div>

          {/* Google Flow Wrapper */}
          <div className="flex flex-col gap-6">
            <div className="w-full transition-all duration-300 hover:opacity-90 active:scale-[0.99] rounded-2xl overflow-hidden shadow-lg shadow-primary/5">
               <GoogleLogin
                 onSuccess={handleGoogleSuccess}
                 onError={() => setError('Google initialization failed. Check your app connection.')}
                 useOneTap
                 theme="filled_black"
                 size="large"
                 shape="pill"
                 text="continue_with"
                 width="100%"
               />
            </div>
            <p className="text-center text-xs text-text-secondary font-medium">
              Don't have an account? <Link to="/register" className="text-primary font-bold hover:opacity-80 transition-all underline underline-offset-8 decoration-primary/20">Create one</Link>
            </p>
          </div>
          
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
