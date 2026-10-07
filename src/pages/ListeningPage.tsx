import React, { useState, useEffect } from 'react';
import { contentStore } from '../services/contentStore';
import { ListeningTest } from '../types';
import { ListeningPractice } from '../components/listening/ListeningPractice';
import {
  Headphones,
  Search,
  Filter,
  Clock,
  HelpCircle,
  ArrowRight,
  Radio,
  Play,
  Volume2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ListeningPageProps {
  initialTestSlug?: string;
  onNavigate?: (path: string) => void;
}

export const ListeningPage: React.FC<ListeningPageProps> = ({
  initialTestSlug,
  onNavigate,
}) => {
  const tests = contentStore.getListeningTests();

  const [selectedTest, setSelectedTest] = useState<ListeningTest | null>(() => {
    if (initialTestSlug) {
      return contentStore.getListeningTest(initialTestSlug) || null;
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Sync test when initialTestSlug prop changes (e.g. browser back/forward or route change)
  useEffect(() => {
    if (initialTestSlug) {
      const found = contentStore.getListeningTest(initialTestSlug);
      setSelectedTest(found || null);
    } else {
      setSelectedTest(null);
    }
  }, [initialTestSlug]);

  const handleStartTest = (test: ListeningTest) => {
    if (onNavigate) {
      onNavigate(`/listening/${test.slug}`);
    } else {
      setSelectedTest(test);
    }
  };

  const handleBackToDirectory = () => {
    if (onNavigate) {
      onNavigate('/listening');
    } else {
      setSelectedTest(null);
    }
  };

  const handleNavigateTest = (testSlug: string) => {
    if (onNavigate) {
      onNavigate(`/listening/${testSlug}`);
    } else {
      const next = contentStore.getListeningTest(testSlug);
      if (next) setSelectedTest(next);
    }
  };

  const sections = ['All', 'Section 1', 'Section 2', 'Section 3', 'Section 4'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'IELTS Exam Level'];

  const filteredTests = tests.filter((t) => {
    if (t.published === false) return false;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.topic && t.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.situation && t.situation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSection =
      selectedSection === 'All' || `Section ${t.section}` === selectedSection;
    const matchesDifficulty =
      selectedDifficulty === 'All' || t.difficulty === selectedDifficulty;
    return matchesSearch && matchesSection && matchesDifficulty;
  });

  // If a slug was requested but doesn't exist in the store
  if (initialTestSlug && !selectedTest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Listening Test Not Found
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            The listening test route <code className="text-red-600 font-mono">/listening/{initialTestSlug}</code> could not be found or has moved.
          </p>
        </div>
        <div>
          <button
            onClick={handleBackToDirectory}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Listening Tests Directory</span>
          </button>
        </div>
      </div>
    );
  }

  // If a specific test is active (either via URL /listening/test-01 or selection)
  if (selectedTest) {
    const curIdx = tests.findIndex((t) => t.id === selectedTest.id);
    const prevTest = curIdx > 0 ? tests[curIdx - 1] : null;
    const nextTest = curIdx >= 0 && curIdx < tests.length - 1 ? tests[curIdx + 1] : null;

    return (
      <div className="space-y-6">
        {/* Sub-header bar for route and fast switcher */}
        <div className="bg-white dark:bg-[#0c0f17] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBackToDirectory}
                className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>All Listening Tests</span>
              </button>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="font-mono text-red-600 dark:text-red-400 font-semibold">
                /listening/{selectedTest.slug}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {prevTest && (
                <button
                  onClick={() => handleNavigateTest(prevTest.slug)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold transition-colors"
                  title={`Previous: ${prevTest.title}`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev Test ({prevTest.slug})</span>
                </button>
              )}
              {nextTest && (
                <button
                  onClick={() => handleNavigateTest(nextTest.slug)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-semibold transition-colors"
                  title={`Next: ${nextTest.title}`}
                >
                  <span className="hidden sm:inline">Next Test ({nextTest.slug})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Practice component */}
        <ListeningPractice
          test={selectedTest}
          onBack={handleBackToDirectory}
          onPracticeWeakArea={() => {
            if (onNavigate) onNavigate('/practice');
          }}
        />
      </div>
    );
  }

  // Main Listening Tests Directory (/listening)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              IELTS Listening Simulation Engine
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Listening Practice Repository
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
          Practice authentic dialogues and academic monologues with dedicated ~10-minute continuous audio tests, separate individual routes, and deep mistake analytics.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search listening tracks by topic (e.g. Hotel, University, Sports, Library, Science)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full md:w-48 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  Difficulty: {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">IELTS Part:</span>
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSection === sec
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>{filteredTests.length} Separate Audio Tests Available</span>
          <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            ~10:00 Duration Each (4 Parts)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const qCount = test.parts
              ? test.parts.reduce((acc, p) => acc + (p.questions?.length || 0), 0)
              : test.questions?.length || 0;

            return (
              <div
                key={test.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 shadow-xs hover:border-red-400/80 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40">
                      Route: /listening/{test.slug}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {test.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors leading-snug">
                    {test.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {test.description || test.situation}
                  </p>

                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-red-500" />
                        <span>~10 mins total (4 Parts)</span>
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>{qCount} questions</span>
                      </span>
                    </div>

                    {/* 4 Parts mini checklist */}
                    <div className="grid grid-cols-4 gap-1 pt-1 text-[10px] font-mono text-center">
                      {(test.parts || []).map((p) => (
                        <span
                          key={p.id}
                          className="py-0.5 px-1 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                        >
                          P{p.partNumber}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dedicated Audio & Full Transcript</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 dark:border-slate-800 mt-4">
                  <button
                    onClick={() => handleStartTest(test)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-red-600 text-white dark:bg-slate-800 dark:hover:bg-red-600 shadow-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Test ({test.slug})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
