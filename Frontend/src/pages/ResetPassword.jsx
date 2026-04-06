import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen w-full flex items-center justify-center bg-bg px-6 py-12 selection:bg-primary/30 text-text-primary">
      <div className="card w-full max-w-md">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <div>
             <h2 className="text-lg font-semibold text-text-primary leading-none mb-1">New password</h2>
             <p className="text-xs text-text-secondary opacity-70">Enter your new credentials below</p>
          </div>
        </div>

        {status.message && (
          <div className={`mb-6 border text-sm p-4 rounded-xl flex items-center gap-3 ${
            status.type === 'error' 
              ? 'bg-red-400/10 border-red-400/20 text-red-400' 
              : 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400'
          }`}>
             {status.type === 'error' ? (
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            )}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5 ml-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                disabled={loading || status.type === 'success'}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-field"
                disabled={loading || status.type === 'success'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || status.type === 'success'}
            className="btn-primary w-full"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span>Resetting...</span>
              </div>
            ) : "Update Password"}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <Link to="/forgot-password" className="text-[10px] font-bold text-text-secondary uppercase tracking-widest hover:text-primary transition-colors">
            Request a new link instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
