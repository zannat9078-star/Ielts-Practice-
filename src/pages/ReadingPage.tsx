import React, { useState } from 'react';
import { contentStore } from '../services/contentStore';
import { ReadingTopic, DifficultyLevel } from '../types';
import { ReadingPractice } from '../components/reading/ReadingPractice';
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ReadingPageProps {
  initialTopicSlug?: string;
}

export const ReadingPage: React.FC<ReadingPageProps> = ({ initialTopicSlug }) => {
  const [selectedTopic, setSelectedTopic] = useState<ReadingTopic | null>(() => {
    if (initialTopicSlug) {
      return contentStore.getReadingTopic(initialTopicSlug) || null;
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const topics = contentStore.getReadingTopics();

  // Distinct categories
  const categories = ['All', ...Array.from(new Set(topics.map((t) => t.category)))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'IELTS Exam Level'];

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || topic.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'All' || topic.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  if (selectedTopic) {
    return (
      <ReadingPractice
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
        onPracticeWeakArea={(cat) => {
          setSelectedTopic(null);
          // could filter or drill
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              IELTS Academic & General Reading Repository
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Reading Practice Library
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
          Practice authentic IELTS passages with full question sets, timed conditions, text highlighting, and deep reasoning analysis.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search input */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search passages by topic keyword, title or content..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full md:w-48 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  Difficulty: {diff}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">Topic:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>{filteredTopics.length} Practice Topics Found</span>
          <span>Official 20-Minute Test Format</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 shadow-xs hover:border-red-400/80 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40">
                    {topic.category}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {topic.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors leading-snug">
                  {topic.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {topic.summary}
                </p>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{topic.durationMinutes} mins timer</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <HelpCircle className="w-3.5 h-3.5 text-red-500" />
                    <span>{topic.questions.length} questions</span>
                  </span>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  onClick={() => setSelectedTopic(topic)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-red-600 text-white dark:bg-slate-800 dark:hover:bg-red-600 shadow-xs transition-colors"
                >
                  <span>Practice This Passage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTopics.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching reading topics found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or reset your filters. Administrators can also add new topics via the Admin dashboard.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
              }}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
