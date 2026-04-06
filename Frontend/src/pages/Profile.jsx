import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as userApi from '../api/userApi';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const updatedUser = await userApi.updateProfile({ 
        name: name !== user.name ? name : undefined, 
        avatar_url: avatarUrl !== user.avatar_url ? avatarUrl : undefined 
      });
      setUser(updatedUser);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg px-6 py-12 selection:bg-primary/30 text-text-primary">
      <div className="card w-full max-w-lg">
        
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <div>
                 <h2 className="text-lg font-semibold text-text-primary leading-none mb-1">Account Settings</h2>
                 <p className="text-xs text-text-secondary opacity-70">Manage your profile and preferences</p>
              </div>
           </div>
           <button 
              onClick={() => window.history.back()}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              title="Go Back"
           >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
           </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
           {/* Left: Avatar Preview */}
           <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="relative group">
                {user?.avatar_url || avatarUrl ? (
                  <img 
                    src={avatarUrl || user.avatar_url} 
                    alt="Avatar" 
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-surface shadow-xl ring-1 ring-border group-hover:scale-[1.02] transition-transform"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-4xl font-bold border-4 border-surface shadow-xl ring-1 ring-border group-hover:scale-[1.02] transition-transform">
                    {name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="px-3 py-1 rounded-full bg-surface border border-border/50 text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                 {user?.provider || 'Linear'} Account
              </div>
           </div>

           {/* Right: Form fields */}
           <div className="flex-1 flex flex-col gap-6">
              {message && <div className="text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 p-4 rounded-xl text-xs font-semibold flex items-center gap-3 animate-fadeIn">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 {message}
              </div>}
              {error && <div className="text-red-400 bg-red-400/10 border border-red-400/20 p-4 rounded-xl text-xs font-semibold flex items-center gap-3 animate-fadeIn">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 {error}
              </div>}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                    <input 
                      type="text" 
                      value={user?.email || ''} 
                      disabled
                      className="input-field opacity-50 cursor-not-allowed bg-bg/50 border-dashed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Display Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="input-field"
                      placeholder="Your workspace name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Avatar URL</label>
                    <input 
                      type="url" 
                      value={avatarUrl} 
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="input-field"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                   <button 
                     type="submit" 
                     disabled={loading || (name === user.name && avatarUrl === (user.avatar_url || ''))}
                     className="btn-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
                   >
                     {loading ? (
                        <div className="flex items-center gap-2">
                           <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                           <span>Saving Changes...</span>
                        </div>
                     ) : 'Save Changes'}
                   </button>
                </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
