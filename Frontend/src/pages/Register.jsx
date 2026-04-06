import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import apiClient from '../api/apiClient';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your_google_client_id_here";

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
      <div className="min-h-screen w-full flex items-center justify-center bg-bg px-6 py-12 selection:bg-primary/30 text-text-primary">
        <div className="card w-full max-w-md">
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
               <h2 className="text-lg font-semibold text-text-primary leading-none mb-1">Create account</h2>
               <p className="text-xs text-text-secondary opacity-70">Join LinearGen to start generating</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-400/10 border border-red-400/20 text-red-400 text-sm p-4 rounded-xl flex items-center gap-3">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleEmailRegister} className="flex flex-col gap-5 mb-8">
            <div className="flex flex-col gap-4">
               <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input-field"
                    disabled={loading}
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Email</label>
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
               <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Password</label>
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
                  <span>Processing...</span>
                </div>
              ) : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-8">
            <div className="w-full h-px bg-border/50"></div>
            <span className="absolute bg-surface px-4 text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] opacity-40">
              Third Party Sign Up
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="w-full hover:scale-[1.01] active:scale-[0.99] transition-all duration-200">
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
            <p className="text-center text-xs text-text-secondary">
              Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4">Log in</Link>
            </p>
          </div>
          
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
