import React, { useState } from 'react';
import {
  Sprout,
  Sun,
  Moon,
  Settings,
  Menu,
  X,
  History,
  ScanLine,
  Home,
  Info,
  Users,
  User as UserIcon,
  LogIn,
  Award,
  ShieldCheck,
  BookOpen,
  Search,
} from 'lucide-react';
import { Language, ThemeMode, UserRole } from '../types';
import { t } from '../utils/translations';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeTab: 'home' | 'detect' | 'plant-care' | 'history' | 'community' | 'about';
  onNavigate: (tab: 'home' | 'detect' | 'plant-care' | 'history' | 'community' | 'about') => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  historyCount: number;
  language?: Language;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  theme,
  onToggleTheme,
  onOpenSettings,
  historyCount,
  language = 'en',
}) => {
  const { user, openAuthModal, openProfileModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as const, label: t('navHome', language), icon: Home },
    { id: 'detect' as const, label: t('navDetect', language), icon: ScanLine, highlight: true },
    { id: 'plant-care' as const, label: 'Plant Care', icon: BookOpen },
    { id: 'community' as const, label: 'Community', icon: Users },
    { id: 'history' as const, label: t('navHistory', language), icon: History, count: historyCount },
    { id: 'about' as const, label: t('navAbout', language), icon: Info },
  ];

  const handleNavClick = (tab: 'home' | 'detect' | 'plant-care' | 'history' | 'community' | 'about') => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  const getRoleIcon = (r: UserRole) => {
    switch (r) {
      case 'agronomist':
        return Award;
      case 'moderator':
        return ShieldCheck;
      default:
        return Sprout;
    }
  };

  const RoleIcon = user ? getRoleIcon(user.role) : UserIcon;

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 w-full h-16 sm:h-18 bg-white/95 dark:bg-[#142017]/95 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-900/60 transition-colors flex items-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          id="brand-logo-button"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-sm group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-emerald-900 dark:text-emerald-100">
                AgriGuard <span className="text-emerald-500">AI</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/60 font-medium tracking-wide hidden sm:block">
              {t('appTagline', language)}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer py-1 ${
                  isActive
                    ? 'font-semibold text-emerald-800 dark:text-emerald-300 border-b-2 border-emerald-600 pb-1'
                    : 'text-emerald-600/70 dark:text-emerald-400/70 hover:text-emerald-800 dark:hover:text-emerald-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools: Auth, Theme & Settings */}
        <div className="flex items-center gap-2">
          {/* User Profile or Login CTA */}
          {user ? (
            <button
              id="user-profile-button"
              onClick={openProfileModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer group"
              title="View Account Profile & Sync Settings"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-emerald-950 dark:text-white leading-tight truncate max-w-24">
                  {user.displayName || 'Farmer'}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 capitalize font-medium">
                  {user.role}
                </span>
              </div>
            </button>
          ) : (
            <button
              id="login-button"
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/80 hover:bg-emerald-200 text-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-xs font-bold transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Log In</span>
            </button>
          )}

          {/* Quick Plant Care Search Trigger in Header */}
          {activeTab !== 'plant-care' && (
            <button
              id="header-search-plants-btn"
              onClick={() => handleNavClick('plant-care')}
              className="p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
              title="Search Plant Care & Guides"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* Quick Scan CTA Button in Header on Desktop */}
          {activeTab !== 'detect' && (
            <button
              onClick={() => handleNavClick('detect')}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm shadow-emerald-200 dark:shadow-none transition-all cursor-pointer"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Scan Crop</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className="p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
            title={`Switch Theme (Current: ${theme})`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-emerald-700" />
            )}
          </button>

          {/* Settings Modal Trigger */}
          <button
            id="open-settings-btn"
            onClick={onOpenSettings}
            className="p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
            title={t('navSettings', language)}
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 transition-colors"
            title="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-b border-emerald-100 dark:border-emerald-900/60 bg-white dark:bg-[#142017] px-4 pt-2 pb-6 space-y-1.5 shadow-xl animate-fade-in z-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
                  isActive
                    ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800'
                    : 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* User Account / Profile action inside mobile menu */}
          <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openProfileModal();
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-white text-xs font-bold flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span>{user.displayName || 'Farmer'} ({user.role})</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold">Manage Profile</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In / Create Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

