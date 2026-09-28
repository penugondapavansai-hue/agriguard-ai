import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  MapPin,
  Sprout,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalDefaultTab,
    closeAuthModal,
    loginWithEmail,
    signUpWithEmail,
    loginWithGoogle,
    loginAsGuest,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [location, setLocation] = useState('');
  const [cropSpecialty, setCropSpecialty] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync active tab when modal opens
  React.useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalDefaultTab);
      setError(null);
    }
  }, [isAuthModalOpen, authModalDefaultTab]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === 'login') {
        if (!email || !password) {
          throw new Error('Please enter both email and password.');
        }
        await loginWithEmail(email, password);
      } else {
        if (!email || !password || !displayName) {
          throw new Error('Please fill in your name, email, and password.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await signUpWithEmail(email, password, displayName, role, location, cropSpecialty);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed. Please check your details.';
      if (msg.includes('auth/invalid-email')) msg = 'Invalid email address format.';
      if (msg.includes('auth/user-not-found') || msg.includes('auth/wrong-password') || msg.includes('auth/invalid-credential'))
        msg = 'Invalid email or password.';
      if (msg.includes('auth/email-already-in-use'))
        msg = 'This email is already registered. Please log in instead.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle(role);
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message || 'Google Sign-In was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginAsGuest('Field Explorer', role, location || 'Local Region');
    } catch (err: any) {
      console.error('Guest sign in error:', err);
      setError(err.message || 'Could not start guest session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-[#142017] border border-emerald-100 dark:border-emerald-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 text-emerald-600/70 hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>AgriGuard Account</span>
          </div>
          <h2 className="text-2xl font-bold text-emerald-950 dark:text-white tracking-tight">
            {activeTab === 'login' ? 'Welcome Back, Farmer' : 'Join AgriGuard Community'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-800/70 dark:text-emerald-300/70">
            {activeTab === 'login'
              ? 'Log in to sync your field diagnoses across all devices and participate in agronomy discussions.'
              : 'Create a free account to track crop health history, ask experts, and get community advice.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError(null);
            }}
            className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white dark:bg-[#1f3124] text-emerald-950 dark:text-white shadow-xs'
                : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-950'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setError(null);
            }}
            className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white dark:bg-[#1f3124] text-emerald-950 dark:text-white shadow-xs'
                : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-950'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <>
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  Full Name / Farm Identity
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-600/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Ramesh Patel, Dr. Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl text-xs sm:text-sm text-emerald-950 dark:text-white placeholder:text-emerald-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                  Select Your Primary Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('farmer')}
                    className={`p-2.5 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                      role === 'farmer'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-bold'
                        : 'border-emerald-100 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50/40'
                    }`}
                  >
                    <Sprout className="w-4 h-4 text-emerald-600 mb-1" />
                    <div className="font-bold">Farmer</div>
                    <div className="text-[10px] opacity-75 font-normal">Grower / Farm Owner</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('agronomist')}
                    className={`p-2.5 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                      role === 'agronomist'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-bold'
                        : 'border-emerald-100 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50/40'
                    }`}
                  >
                    <Award className="w-4 h-4 text-emerald-600 mb-1" />
                    <div className="font-bold">Agronomist</div>
                    <div className="text-[10px] opacity-75 font-normal">Scientist / Extension</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('moderator')}
                    className={`p-2.5 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                      role === 'moderator'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-bold'
                        : 'border-emerald-100 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50/40'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                    <div className="font-bold">Moderator</div>
                    <div className="text-[10px] opacity-75 font-normal">Community Guide</div>
                  </button>
                </div>
              </div>

              {/* Location & Crop Specialty in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                    Location / Region
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600/70 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Nashik, Guntur, Punjab"
                      className="w-full pl-9 pr-3 py-2 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white placeholder:text-emerald-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                    Primary Crops
                  </label>
                  <input
                    type="text"
                    value={cropSpecialty}
                    onChange={(e) => setCropSpecialty(e.target.value)}
                    placeholder="e.g. Cotton, Tomato, Chili"
                    className="w-full px-3 py-2 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-950 dark:text-white placeholder:text-emerald-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-emerald-600/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl text-xs sm:text-sm text-emerald-950 dark:text-white placeholder:text-emerald-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-emerald-600/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl text-xs sm:text-sm text-emerald-950 dark:text-white placeholder:text-emerald-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              <>
                <span>{activeTab === 'login' ? 'Sign In to AgriGuard' : 'Create Farmer Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-emerald-100 dark:border-emerald-900/40 w-full" />
          <span className="bg-white dark:bg-[#142017] px-3 text-[11px] uppercase tracking-wider text-emerald-600/70 font-bold">
            Or quick access
          </span>
        </div>

        {/* Alternative Auth options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="py-2.5 px-3 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl text-xs font-bold text-emerald-950 dark:text-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Google Login</span>
          </button>

          <button
            type="button"
            onClick={handleGuestSignIn}
            disabled={loading}
            className="py-2.5 px-3 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl text-xs font-bold text-emerald-950 dark:text-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Try as Demo Guest</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center">
          <p className="text-[11px] text-emerald-800/60 dark:text-emerald-400/50">
            By signing in, your crop diagnoses sync automatically across your mobile phone, tablet, and PC.
          </p>
        </div>
      </div>
    </div>
  );
};
