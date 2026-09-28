import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  supabase,
  getUserProfile,
  signInWithEmail as sbSignInEmail,
  signUpWithEmail as sbSignUpEmail,
  signInWithGoogle as sbSignInGoogle,
  signInAsGuest as sbSignInGuest,
  signOutUser as sbSignOut,
  updateUserProfile as sbUpdateProfile,
  saveUserProfile,
} from '../services/supabase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: any | null; // Kept for interface compatibility
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalDefaultTab: 'login' | 'signup';
  isProfileModalOpen: boolean;
  openAuthModal: (defaultTab?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    pass: string,
    displayName: string,
    role?: UserRole,
    location?: string,
    cropSpecialty?: string
  ) => Promise<void>;
  loginWithGoogle: (preferredRole?: UserRole) => Promise<void>;
  loginAsGuest: (name?: string, role?: UserRole, location?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState<'login' | 'signup'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Supabase auth subscription if available
    if (supabase) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (!isMounted) return;
        if (session?.user) {
          setFirebaseUser(session.user);
          try {
            let profile = await getUserProfile(session.user.id);
            if (!profile) {
              profile = {
                uid: session.user.id,
                email: session.user.email || null,
                displayName: session.user.user_metadata?.displayName || 'Farmer',
                role: (session.user.user_metadata?.role as UserRole) || 'farmer',
                joinedAt: new Date().toISOString(),
              };
              await saveUserProfile(profile);
            }
            if (isMounted) setUser(profile);
          } catch {
            if (isMounted) {
              setUser({
                uid: session.user.id,
                email: session.user.email || null,
                displayName: 'Farmer',
                role: 'farmer',
                joinedAt: new Date().toISOString(),
              });
            }
          }
        } else {
          checkLocalSession();
        }
        if (isMounted) setIsLoading(false);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!isMounted) return;
        if (session?.user) {
          setFirebaseUser(session.user);
          const profile = await getUserProfile(session.user.id);
          if (isMounted) setUser(profile);
        } else {
          setFirebaseUser(null);
          setUser(null);
        }
      });

      return () => {
        isMounted = false;
        authListener.subscription.unsubscribe();
      };
    } else {
      checkLocalSession();
      setIsLoading(false);
    }

    function checkLocalSession() {
      const activeUid = localStorage.getItem('agriguard_active_uid');
      if (activeUid) {
        getUserProfile(activeUid).then((p) => {
          if (isMounted) setUser(p);
        });
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const openAuthModal = (defaultTab: 'login' | 'signup' = 'login') => {
    setAuthModalDefaultTab(defaultTab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const profile = await sbSignInEmail(email, pass);
    setUser(profile);
    closeAuthModal();
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    role: UserRole = 'farmer',
    location = '',
    cropSpecialty = ''
  ) => {
    const profile = await sbSignUpEmail(email, pass, displayName, role, location, cropSpecialty);
    setUser(profile);
    closeAuthModal();
  };

  const loginWithGoogle = async (preferredRole: UserRole = 'farmer') => {
    const profile = await sbSignInGoogle(preferredRole);
    setUser(profile);
    closeAuthModal();
  };

  const loginAsGuest = async (
    name: string = 'Local Farmer',
    role: UserRole = 'farmer',
    location: string = 'Field Zone'
  ) => {
    const profile = await sbSignInGuest(name, role, location);
    setUser(profile);
    closeAuthModal();
  };

  const logout = async () => {
    await sbSignOut();
    setUser(null);
    closeProfileModal();
  };

  const updateProfileData = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = await sbUpdateProfile(user.uid, updates);
    if (updated) {
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        isAuthModalOpen,
        authModalDefaultTab,
        isProfileModalOpen,
        openAuthModal,
        closeAuthModal,
        openProfileModal,
        closeProfileModal,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        loginAsGuest,
        logout,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
