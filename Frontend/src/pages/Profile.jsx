import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as userApi from '../api/userApi';
import { User, Mail, Link as LinkIcon, Save, LogOut, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
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
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white selection:bg-white/10 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <div className="h-px flex-1 bg-white/5 mx-6 hidden sm:block"></div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-medium border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Main Profile Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Cover Header */}
          <div className="h-32 bg-gradient-to-r from-zinc-800 to-zinc-900 relative">
            <div className="absolute -bottom-12 left-8 p-1 bg-zinc-900 rounded-2xl border border-white/10">
              {user?.avatar_url || avatarUrl ? (
                <img 
                  src={avatarUrl || user.avatar_url} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-xl object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-zinc-800 flex items-center justify-center text-3xl font-bold text-zinc-500">
                  {name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight">{user?.name}</h1>
              <p className="text-zinc-400 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
            </div>

            {/* Notifications */}
            {message && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                {message}
              </div>
            )}
            {error && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Name field */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Display Name</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-800/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-white/10 outline-none transition-all hover:bg-zinc-800"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                {/* Avatar field */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Avatar URL</label>
                  <div className="relative group">
                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                    <input 
                      type="url" 
                      value={avatarUrl} 
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full bg-zinc-800/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-white/10 outline-none transition-all hover:bg-zinc-800"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="text" 
                    value={user?.email || ''} 
                    disabled
                    className="w-full bg-zinc-900/50 border border-dashed border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-zinc-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-end pt-4 border-t border-white/5 gap-4">
                <button 
                  type="submit" 
                  disabled={loading || (name === user.name && avatarUrl === (user.avatar_url || ''))}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-zinc-500 text-xs mt-8">
          Manage your account settings and profile information. All changes are synced across devices.
        </p>
      </div>
    </div>
  );
};

export default Profile;
