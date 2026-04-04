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
    <div className="min-h-screen bg-slate-950 text-white flex justify-center py-20 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl h-fit">
        <h2 className="text-2xl font-bold mb-6 text-emerald-400">Your Profile</h2>

        <div className="flex flex-col items-center mb-6">
          {user?.avatar_url || avatarUrl ? (
            <img 
              src={avatarUrl || user.avatar_url} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-lg mb-4"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-bold border-4 border-slate-800 shadow-lg mb-4">
              {name?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-slate-400 text-sm bg-slate-800 px-3 py-1 rounded-full">{user?.provider} provider</span>
        </div>

        {message && <div className="mb-4 text-emerald-400 bg-emerald-400/10 p-3 rounded-lg text-sm text-center">{message}</div>}
        {error && <div className="mb-4 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
            <input 
              type="text" 
              value={user?.email || ''} 
              disabled
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Avatar URL</label>
            <input 
              type="url" 
              value={avatarUrl} 
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || (name === user.name && avatarUrl === (user.avatar_url || ''))}
            className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
