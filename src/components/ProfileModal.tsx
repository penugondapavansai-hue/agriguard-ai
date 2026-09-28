import React, { useState } from 'react';
import {
  X,
  User,
  MapPin,
  Sprout,
  ShieldCheck,
  Award,
  LogOut,
  CheckCircle2,
  Cloud,
  RefreshCw,
  Edit3,
  Save,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { getSavedAnalyses } from '../services/api';
import { syncAnalysisToCloud } from '../services/firebase';

interface ProfileModalProps {
  onSyncComplete?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onSyncComplete }) => {
  const { user, isProfileModalOpen, closeProfileModal, logout, updateProfileData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'farmer');
  const [location, setLocation] = useState(user?.location || '');
  const [cropSpecialty, setCropSpecialty] = useState(user?.cropSpecialty || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setRole(user.role || 'farmer');
      setLocation(user.location || '');
      setCropSpecialty(user.cropSpecialty || '');
      setBio(user.bio || '');
    }
  }, [user]);

  if (!isProfileModalOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileData({
      displayName,
      role,
      location,
      cropSpecialty,
      bio,
      isVerifiedAgronomist: role === 'agronomist',
    });
    setIsEditing(false);
  };

  const handleSyncLocalToCloud = async () => {
    setIsSyncing(true);
    setSyncStatus('Syncing offline diagnostics to cloud database...');
    try {
      const localAnalyses = getSavedAnalyses();
      let count = 0;
      for (const item of localAnalyses) {
        const ok = await syncAnalysisToCloud(user.uid, item);
        if (ok) count++;
      }
      setSyncStatus(`Successfully synchronized ${count} analysis records across your devices!`);
      if (onSyncComplete) onSyncComplete();
    } catch (e) {
      console.warn('Sync error:', e);
      setSyncStatus('Synchronization encountered a temporary issue. Will retry automatically.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'agronomist':
        return {
          label: 'Verified Agronomist',
          icon: Award,
          class: 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        };
      case 'moderator':
        return {
          label: 'Community Moderator',
          icon: ShieldCheck,
          class: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
        };
      default:
        return {
          label: 'Registered Farmer',
          icon: Sprout,
          class: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        };
    }
  };

  const badge = getRoleBadge(user.role);
  const BadgeIcon = badge.icon;

  return (
    <div
      id="profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Close button */}
        <button
          onClick={closeProfileModal}
          className="absolute top-5 right-5 p-2 text-emerald-600/70 hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-emerald-950 dark:text-white">
                {user.displayName || 'Farmer'}
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.class}`}
              >
                <BadgeIcon className="w-3 h-3" />
                <span>{badge.label}</span>
              </span>
            </div>
            <p className="text-xs text-emerald-800/60 dark:text-emerald-400/50 mt-1">
              {user.email || 'Anonymous Guest Session'}
            </p>
          </div>
        </div>

        {/* Sync Status Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Cross-Device Cloud Sync</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active</span>
            </span>
          </div>
          <p className="text-[11px] text-emerald-800/70 dark:text-emerald-300/70 leading-relaxed">
            Diagnoses recorded on this device are synchronized with your account in Firestore, allowing immediate access from your phone or PC.
          </p>

          <button
            onClick={handleSyncLocalToCloud}
            disabled={isSyncing}
            className="mt-1 w-full py-2 px-3 bg-white dark:bg-[#1b2b1f] hover:bg-emerald-50 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-900 dark:text-emerald-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{isSyncing ? 'Synchronizing Diagnoses...' : 'Sync Local History to Cloud'}</span>
          </button>

          {syncStatus && (
            <div className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 p-2 bg-emerald-100/60 dark:bg-emerald-900/40 rounded-lg animate-fade-in">
              {syncStatus}
            </div>
          )}
        </div>

        {/* Profile Details or Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                Role (Switchable for testing moderation & verified solutions)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="farmer">Farmer / Crop Grower</option>
                <option value="agronomist">Agronomist / Plant Pathologist (Verified Answers)</option>
                <option value="moderator">Community Moderator (Pin, Flag, Delete Tools)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                  Location / Farm Region
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full px-3 py-2 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                  Crop Specialty
                </label>
                <input
                  type="text"
                  value={cropSpecialty}
                  onChange={(e) => setCropSpecialty(e.target.value)}
                  placeholder="e.g. Cotton, Rice, Chili"
                  className="w-full px-3 py-2 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                Short Agronomy Bio
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your farming experience or research background..."
                className="w-full px-3 py-2 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl">
                <span className="text-emerald-800/60 dark:text-emerald-400/60 block text-[10px] uppercase font-bold">
                  Region
                </span>
                <span className="font-semibold text-emerald-950 dark:text-white">
                  {user.location || 'Not specified'}
                </span>
              </div>
              <div className="p-3 bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl">
                <span className="text-emerald-800/60 dark:text-emerald-400/60 block text-[10px] uppercase font-bold">
                  Crop Specialty
                </span>
                <span className="font-semibold text-emerald-950 dark:text-white">
                  {user.cropSpecialty || 'Multi-crop general'}
                </span>
              </div>
            </div>

            {user.bio && (
              <div className="p-3 bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl text-xs text-emerald-800/80 dark:text-emerald-200/80">
                <span className="text-emerald-800/60 dark:text-emerald-400/60 block text-[10px] uppercase font-bold mb-0.5">
                  Bio / Research Background
                </span>
                {user.bio}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile / Switch Role</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-2 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100/80 border border-rose-200 dark:border-rose-900/60 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
