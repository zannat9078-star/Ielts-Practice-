import React from 'react';
import { Logo } from '../common/Logo';
import { BookOpen, Headphones, PenTool, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#080a0f] text-slate-600 dark:text-slate-400 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <button onClick={() => onNavigate('/')} className="text-left focus:outline-none">
              <Logo size="md" />
            </button>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              The comprehensive interactive practice environment for IELTS Academic and General Training candidates worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Full Audio Engine & Diagnostic Feedback Active</span>
            </div>
          </div>

          {/* Module Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Practice Modules
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => onNavigate('/reading')}
                  className="hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-red-500" />
                  <span>IELTS Reading (Academic & GT)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/listening')}
                  className="hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 transition-colors"
                >
                  <Headphones className="w-3.5 h-3.5 text-red-500" />
                  <span>IELTS Listening (Sections 1–4)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/writing')}
                  className="hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 transition-colors"
                >
                  <PenTool className="w-3.5 h-3.5 text-red-500" />
                  <span>IELTS Writing (Task 1 & Task 2)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/practice')}
                  className="hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 transition-colors"
                >
                  <span>Weak Area Practice Drills</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Student Hub */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Student Hub
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => onNavigate('/progress')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Score Analytics & History
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Official Band Descriptors 1–9 Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/profile')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Target Band & Study Schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 text-slate-500"
                >
                  <ShieldCheck className="w-3 h-3 text-amber-500" />
                  <span>Admin Content Management</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Educational Disclaimer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Preparation Ethics
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              IELTS® is a registered trademark of University of Cambridge ESOL, the British Council, and IDP Education Australia. IELTS PRACTICE HUB is an independent educational preparatory platform designed to empower self-directed learners.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} IELTS PRACTICE HUB. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered for Band 7.0+ Aspirants <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
