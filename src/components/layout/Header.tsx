import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  Sun,
  Moon,
  Menu,
  X,
  BookOpen,
  Headphones,
  PenTool,
  Award,
  TrendingUp,
  Info,
  ShieldCheck,
  User as UserIcon,
  Home,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, quickSwitchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Reading', path: '/reading', icon: BookOpen },
    { label: 'Listening', path: '/listening', icon: Headphones },
    { label: 'Writing', path: '/writing', icon: PenTool },
    { label: 'Practice', path: '/practice', icon: Sparkles },
    { label: 'Progress', path: '/progress', icon: TrendingUp },
    { label: 'About', path: '/about', icon: Info },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#0c0f17]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNav('/')}
          className="focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg p-1 transition-transform active:scale-95 text-left"
        >
          <Logo size="md" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  active
                    ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-red-600 dark:text-red-400' : 'opacity-70'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls & User Badge */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Admin link if user is admin */}
          {isAdmin && (
            <button
              onClick={() => handleNav('/admin')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${
                currentPath.startsWith('/admin')
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin</span>
            </button>
          )}

          {/* Quick Role Switcher Pill */}
          <div className="hidden xl:flex items-center text-xs bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => quickSwitchRole('student')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                !isAdmin
                  ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => quickSwitchRole('admin')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                isAdmin
                  ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Profile Button */}
          {user ? (
            <button
              onClick={() => handleNav('/profile')}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-red-400 dark:hover:border-red-500/50 transition-all text-left"
            >
              <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="leading-tight hidden md:block">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                  {user.name}
                </span>
                <span className="block text-[10px] text-red-600 dark:text-red-400 font-semibold">
                  Band {user.targetBandScore} Aim
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => handleNav('/login')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile menu and theme buttons */}
        <div className="flex sm:hidden items-center gap-1.5">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open mobile navigation"
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-red-600 text-white'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {isAdmin && (
              <button
                onClick={() => handleNav('/admin')}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  Admin Control Panel
                </span>
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded">Manage</span>
              </button>
            )}

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-medium">Switch Active Role:</span>
              <div className="flex gap-1 text-xs">
                <button
                  onClick={() => quickSwitchRole('student')}
                  className={`px-2 py-1 rounded font-semibold ${
                    !isAdmin ? 'bg-red-600 text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => quickSwitchRole('admin')}
                  className={`px-2 py-1 rounded font-semibold ${
                    isAdmin ? 'bg-red-600 text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {user ? (
              <button
                onClick={() => handleNav('/profile')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <UserIcon className="w-4 h-4 text-red-600" />
                <span>{user.name} (Target Band {user.targetBandScore})</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav('/login')}
                className="w-full py-2.5 rounded-lg text-sm font-bold bg-red-600 text-white text-center"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
