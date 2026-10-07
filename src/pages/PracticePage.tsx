import React, { useState } from 'react';
import { contentStore } from '../services/contentStore';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Target,
  Zap,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Headphones,
  PenTool,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface PracticePageProps {
  onNavigate: (path: string) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const progress = contentStore.getUserProgress(user?.id || 'usr-student-01');

  const [activeDrill, setActiveDrill] = useState<string | null>(null);

  const mistakeFrequencies = Object.entries(progress.mistakeFrequency).sort(
    (a, b) => b[1] - a[1]
  );

  // Fallback frequent areas if user is fresh
  const weakAreas =
    mistakeFrequencies.length > 0
      ? mistakeFrequencies
      : [
          ['Matching Headings Trap', 3],
          ['Distractor Confusion', 2],
          ['Articles & Prepositions', 4],
          ['True / False / Not Given Ambiguity', 2],
        ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Personalized Recommendation Engine
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Adaptive Practice Hub
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
          Targeted micro-drills automatically calibrated to your historical error frequencies and skill bottlenecks.
        </p>
      </div>

      {/* Weakness Engine Spotlight */}
      <div className="rounded-3xl border border-red-200 dark:border-red-900/50 bg-gradient-to-br from-red-50/70 via-white to-slate-50 dark:from-[#150a0d] dark:via-[#0c0f17] dark:to-[#090b10] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Prioritized Learning Recommendations</span>
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Practice My Weak Areas
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300">
            <Target className="w-3.5 h-3.5" />
            <span>Calibrated to Your Target Band {user?.targetBandScore || '7.5'}</span>
          </div>
        </div>

        {/* Weakness Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {weakAreas.slice(0, 4).map(([weakness, freq], idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                    Priority #{idx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{freq} Flagged Mistakes</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {weakness}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Frequent stumbling block in recent attempts. Review passage locating techniques.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/reading')}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-800 dark:text-slate-200 transition-colors"
              >
                <span>Drill This Skill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Rapid Micro-Drills Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>High-Yield Rapid Micro-Drills</span>
          </h3>
          <span className="text-xs text-slate-500">5 to 10 Minutes Each</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Drill 1: True / False / Not Given */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Reading Precision</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                True / False / Not Given Mastery
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Train your brain to recognize the strict boundary between factual contradictions and unmentioned assertions.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/reading')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-red-600 text-white dark:bg-slate-800 dark:hover:bg-red-600 transition-colors"
            >
              Start Drill
            </button>
          </div>

          {/* Drill 2: Number & Date Transcription */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Listening Speed</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Section 1 Number & Postcode Drills
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Practice rapid British telephone numbers, alphanumeric postal codes, and currency amounts without hesitation.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/listening')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-red-600 text-white dark:bg-slate-800 dark:hover:bg-red-600 transition-colors"
            >
              Start Drill
            </button>
          </div>

          {/* Drill 3: Writing Thesis & Overview Builder */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Writing Cohesion</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Task 1 Key Overview Generator
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Learn how to write a 2-sentence Band 9 overview identifying highest peaks, steepest surges, and overall trends.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/writing')}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-red-600 text-white dark:bg-slate-800 dark:hover:bg-red-600 transition-colors"
            >
              Start Drill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
