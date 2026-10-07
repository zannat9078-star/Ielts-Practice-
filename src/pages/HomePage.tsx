import React from 'react';
import { contentStore } from '../services/contentStore';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Headphones,
  PenTool,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const progress = contentStore.getUserProgress(user?.id || 'usr-student-01');

  const readingTopics = contentStore.getReadingTopics();
  const listeningTests = contentStore.getListeningTests();
  const writingTasks = contentStore.getWritingTasks();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-red-50/50 via-white to-slate-50 dark:from-[#130b0e] dark:via-[#0c0f17] dark:to-[#0a0c10]">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40 shadow-xs animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Target Band 7.5+ Interactive Preparation Suite</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Practice Smarter.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">
              Improve Faster.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Practice official IELTS Reading, Listening, and Writing with authentic exam timers, high-fidelity audio playback, instant error detection, and deep line-by-line diagnostic feedback.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onNavigate('/reading')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25 transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Start Reading Practice</span>
            </button>

            <button
              onClick={() => onNavigate('/listening')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-950 shadow-md transition-all active:scale-95"
            >
              <Headphones className="w-4 h-4 text-red-500" />
              <span>Start Listening Practice</span>
            </button>

            <button
              onClick={() => onNavigate('/writing')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <PenTool className="w-4 h-4 text-red-500" />
              <span>Practice Writing</span>
            </button>
          </div>
        </div>

        {/* Live Learning Dashboard Quick Bar */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f131c] p-6 shadow-md grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Target Aim
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1">
                Band {user?.targetBandScore || '7.5'}
                <Target className="w-4 h-4 text-red-500 inline" />
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                On Track
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Reading Avg
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                Band {progress.readingBandAverage.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500">
                {progress.readingCompleted} tests done
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Listening Avg
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                Band {progress.listeningBandAverage.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500">
                {progress.listeningCompleted} audio tests
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Writing Avg
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                Band {progress.writingBandAverage.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-500">
                {progress.writingCompleted} essays scored
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Practice Time
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {progress.totalTimeMinutes}m
              </span>
              <span className="text-[10px] text-slate-500">
                Total focus time
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Overall Band
              </span>
              <span className="text-xl font-black text-red-600 dark:text-red-400">
                Band {progress.overallBandAverage.toFixed(1)}
              </span>
              <button
                onClick={() => onNavigate('/progress')}
                className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-0.5"
              >
                View Analytics <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* IELTS Modules Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block mb-1">
              Official IELTS Modules
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Choose Your Practice Track
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Fully realistic exam environments designed to test academic and general training competencies with instant error feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reading Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 sm:p-7 shadow-xs hover:border-red-400/80 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {readingTopics.length}+ Topics Available
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">
                  IELTS Reading
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Full-length academic passages with interactive paragraph highlighting, matching headings, True/False/Not Given, and sentence completion drills.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Passages Practiced</span>
                <span className="text-slate-900 dark:text-white">{progress.readingCompleted} / {readingTopics.length}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600"
                  style={{ width: `${Math.min(100, (progress.readingCompleted / readingTopics.length) * 100)}%` }}
                />
              </div>
              <button
                onClick={() => onNavigate('/reading')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-red-600 text-white dark:bg-slate-800 dark:hover:bg-red-600 transition-colors"
              >
                <span>Enter Reading Library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Listening Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 sm:p-7 shadow-xs hover:border-red-400/80 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {listeningTests.length}+ Real Audio Tests
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">
                  IELTS Listening
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Dedicated audio player featuring variable speed, section timers, verbatim transcripts, and mistake analysis for acoustic distractors.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Audios Practiced</span>
                <span className="text-slate-900 dark:text-white">{progress.listeningCompleted} / {listeningTests.length}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600"
                  style={{ width: `${Math.min(100, (progress.listeningCompleted / listeningTests.length) * 100)}%` }}
                />
              </div>
              <button
                onClick={() => onNavigate('/listening')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-red-600 text-white dark:bg-slate-800 dark:hover:bg-red-600 transition-colors"
              >
                <span>Enter Listening Tests</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Writing Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 sm:p-7 shadow-xs hover:border-red-400/80 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                <PenTool className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {writingTasks.length}+ Tasks (Task 1 & 2)
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">
                  IELTS Writing
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Distraction-free editor with live word counting, interactive graphs, and 4-criteria IELTS band scoring with line-by-line grammar diagnostics.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Submissions Scored</span>
                <span className="text-slate-900 dark:text-white">{progress.writingCompleted} / {writingTasks.length}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600"
                  style={{ width: `${Math.min(100, (progress.writingCompleted / writingTasks.length) * 100)}%` }}
                />
              </div>
              <button
                onClick={() => onNavigate('/writing')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-red-600 text-white dark:bg-slate-800 dark:hover:bg-red-600 transition-colors"
              >
                <span>Enter Writing Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Practice Here Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c0f17] p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              The IELTS Practice Hub Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Why Prepare Here
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Engineered specifically to transform typical candidate mistakes into high-scoring habits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Instant Feedback</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                No waiting days for grades. Receive immediate question analysis, citations, and official reasoning.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Mistake Detection</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Categorizes errors into vocabulary confusion, distractor traps, grammar concord, or missed transition words.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Unlimited Topics</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Extensible content repository supporting dynamic addition of new passages, listening tracks, and writing tasks.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Progress Tracking</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Real-time band estimates, skill radars, and targeted weakness drills to focus your preparation where it counts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
