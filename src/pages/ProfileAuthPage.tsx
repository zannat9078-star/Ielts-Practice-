import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User as UserIcon,
  Mail,
  Lock,
  Calendar,
  Target,
  LogOut,
  ShieldCheck,
  CheckCircle,
  KeyRound,
  ArrowRight,
} from 'lucide-react';

interface ProfileAuthPageProps {
  mode?: 'login' | 'register' | 'profile' | 'forgot-password';
  onNavigate: (path: string) => void;
}

export const ProfileAuthPage: React.FC<ProfileAuthPageProps> = ({
  mode = 'profile',
  onNavigate,
}) => {
  const { user, login, register, logout, updateProfile, quickSwitchRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'login' | 'register' | 'forgot'>(
    user ? 'profile' : mode === 'register' ? 'register' : mode === 'forgot-password' ? 'forgot' : 'login'
  );

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [targetBand, setTargetBand] = useState(user?.targetBandScore || 7.5);
  const [examDate, setExamDate] = useState(user?.examDate || '2026-11-20');
  const [msg, setMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email || 'candidate@ielts.practice');
    setMsg('Logged in successfully!');
    setActiveTab('profile');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(name || 'New Candidate', email || 'candidate@ielts.practice');
    setMsg('Account created successfully!');
    setActiveTab('profile');
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Password recovery instructions sent to ' + email);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name || user?.name,
      targetBandScore: targetBand,
      examDate,
    });
    setMsg('Candidate profile updated successfully!');
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      {/* Toast */}
      {msg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Tabs */}
      {!user && (
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              activeTab === 'login' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Candidate Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              activeTab === 'register' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Create Account
          </button>
        </div>
      )}

      {/* PROFILE VIEW */}
      {user && activeTab === 'profile' && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-600 text-white text-xl font-black flex items-center justify-center uppercase shadow-md shadow-red-600/30">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{user.name}</h2>
                <span className="text-xs text-slate-500">{user.email}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                    {user.role}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-600"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Candidate Exam Profile
            </h4>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue={user.name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Band Goal</label>
                <select
                  value={targetBand}
                  onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                    <option key={b} value={b}>
                      Band {b.toFixed(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Official Test Date</label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
            >
              Save Profile Changes
            </button>
          </form>

          {/* Role switcher preview for demo ease */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Quick Test Switch:</span>
            <div className="flex gap-2">
              <button
                onClick={() => quickSwitchRole('student')}
                className="px-2.5 py-1 rounded-md border text-slate-700 dark:text-slate-300"
              >
                Switch Student
              </button>
              <button
                onClick={() => quickSwitchRole('admin')}
                className="px-2.5 py-1 rounded-md border text-amber-600 border-amber-300"
              >
                Switch Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN VIEW */}
      {(!user || activeTab === 'login') && activeTab !== 'profile' && activeTab !== 'register' && activeTab !== 'forgot' && (
        <form
          onSubmit={handleLogin}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 sm:p-8 space-y-4 shadow-sm"
        >
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Candidate Sign In</h2>
            <p className="text-xs text-slate-500">
              Access your personalized practice records and diagnostic error history.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@example.com"
                className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('forgot')}
              className="text-red-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-colors"
          >
            Sign In to Practice Hub
          </button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Tip: Enter "admin@ielts.practice" to sign in directly with Admin privileges.
          </p>
        </form>
      )}

      {/* REGISTER VIEW */}
      {activeTab === 'register' && (
        <form
          onSubmit={handleRegister}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 sm:p-8 space-y-4 shadow-sm"
        >
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">New Candidate Registration</h2>
            <p className="text-xs text-slate-500">
              Start your journey toward IELTS Band 7.5+ with instant diagnostic assessments.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Chen"
                className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maya@example.com"
                className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-colors"
          >
            Create Candidate Account
          </button>
        </form>
      )}

      {/* FORGOT PASSWORD VIEW */}
      {activeTab === 'forgot' && (
        <form
          onSubmit={handleForgot}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 sm:p-8 space-y-4 shadow-sm"
        >
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Password Recovery</h2>
            <p className="text-xs text-slate-500">
              Enter your registered email address to receive password reset instructions.
            </p>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@example.com"
              className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition-colors"
          >
            Send Reset Instructions
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className="w-full text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            Back to Sign In
          </button>
        </form>
      )}
    </div>
  );
};
