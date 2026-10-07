import React from 'react';
import { contentStore } from '../services/contentStore';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  Headphones,
  PenTool,
  AlertTriangle,
  Target,
  ArrowUpRight,
  RotateCcw,
} from 'lucide-react';

interface ProgressPageProps {
  onNavigate: (path: string) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const userId = user?.id || 'usr-student-01';
  const progress = contentStore.getUserProgress(userId);
  const attempts = progress.attempts;

  // Filter attempts per module
  const readingAttempts = attempts.filter((a) => a.module === 'reading');
  const listeningAttempts = attempts.filter((a) => a.module === 'listening');
  const writingAttempts = attempts.filter((a) => a.module === 'writing');

  // Compute skill frequencies
  const mistakeEntries = Object.entries(progress.mistakeFrequency).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Candidate Analytics & Band Predictor
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Student Progress Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <Target className="w-4 h-4 text-red-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Target Goal: Band {user?.targetBandScore || '7.5'}
          </span>
        </div>
      </div>

      {/* Top Level Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Overall Estimated Band
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-red-600 dark:text-red-400">
              {progress.overallBandAverage.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +0.5 Trend
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Based on recent diagnostic submissions</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Tests & Tasks Completed
          </span>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {attempts.length}
          </div>
          <p className="text-[11px] text-slate-500">
            {progress.readingCompleted} Reading • {progress.listeningCompleted} Listening • {progress.writingCompleted} Writing
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Total Study Focus
          </span>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {progress.totalTimeMinutes}m
          </div>
          <p className="text-[11px] text-slate-500">Active test room and editing time</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Accuracy Average
          </span>
          <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
            {attempts.length > 0
              ? `${Math.round(attempts.reduce((a, b) => a + (b.accuracy || 0), 0) / attempts.length)}%`
              : '74%'}
          </div>
          <p className="text-[11px] text-slate-500">Across objective reading & listening items</p>
        </div>
      </div>

      {/* Module Band Trajectories */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Skill Improvement Trajectories
            </h3>
            <p className="text-xs text-slate-500">Progressive score evolution across official subtests</p>
          </div>
          <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full">
            Official IELTS 9.0 Scale
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reading Trajectory Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Reading Trend</h4>
              </div>
              <span className="text-xs font-extrabold text-red-600">Band {progress.readingBandAverage.toFixed(1)}</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Historical Progression
              </span>
              <div className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-200 font-mono">
                6.0 → 6.5 → 7.0 → 7.5
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Steady improvement observed in locating factual details. Matching Headings accuracy elevated by 18%.
            </p>
          </div>

          {/* Listening Trajectory Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-red-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Listening Trend</h4>
              </div>
              <span className="text-xs font-extrabold text-red-600">Band {progress.listeningBandAverage.toFixed(1)}</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Historical Progression
              </span>
              <div className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-200 font-mono">
                5.5 → 6.0 → 6.5 → 7.0
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Strong retention of Section 1 telephone & address transcriptions. Maintain vigilance on fast monologue signposts.
            </p>
          </div>

          {/* Writing Trajectory Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-red-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Writing Trend</h4>
              </div>
              <span className="text-xs font-extrabold text-red-600">Band {progress.writingBandAverage.toFixed(1)}</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Historical Progression
              </span>
              <div className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-200 font-mono">
                5.5 → 6.0 → 6.5
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Paragraph structure and length compliance fully established. Continued focus on formal academic collocations advised.
            </p>
          </div>
        </div>
      </div>

      {/* Weakness & Repeated Mistakes Diagnostic */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Historical Mistake Categories</span>
            </h3>
            <p className="text-xs text-slate-500">Collected across all completed reading, listening and writing tests</p>
          </div>

          <button
            onClick={() => onNavigate('/practice')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Practice My Weak Areas</span>
          </button>
        </div>

        {mistakeEntries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mistakeEntries.map(([category, count]) => (
              <div
                key={category}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {category}
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    {count} Recorded Slip(s)
                  </span>
                </div>
                <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950 text-red-600 text-xs font-bold flex items-center justify-center">
                  {count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-4">
            No repeated mistakes recorded yet. Begin practicing passages and listening sets to populate diagnostic patterns.
          </p>
        )}
      </div>

      {/* Recent Practice History Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Recent Practice Submissions Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                <th className="pb-3">Module</th>
                <th className="pb-3">Test Title</th>
                <th className="pb-3">Score / Band</th>
                <th className="pb-3">Accuracy</th>
                <th className="pb-3">Completed On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {attempts.length > 0 ? (
                attempts.slice(0, 8).map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {att.module}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      {att.itemTitle}
                    </td>
                    <td className="py-3 font-bold text-red-600">
                      Band {att.estimatedBand.toFixed(1)}
                    </td>
                    <td className="py-3 font-medium">
                      {att.accuracy}%
                    </td>
                    <td className="py-3 text-slate-400">
                      {new Date(att.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                    No recent submissions recorded yet. Complete a reading passage or essay to see entries here!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
