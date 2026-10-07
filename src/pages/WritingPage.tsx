import React, { useState } from 'react';
import { contentStore } from '../services/contentStore';
import { WritingTask, WritingCategory, WritingTaskType } from '../types';
import { WritingPractice } from '../components/writing/WritingPractice';
import {
  PenTool,
  Search,
  Filter,
  Clock,
  FileText,
  BarChart2,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface WritingPageProps {
  initialTaskSlug?: string;
}

export const WritingPage: React.FC<WritingPageProps> = ({ initialTaskSlug }) => {
  const [selectedTask, setSelectedTask] = useState<WritingTask | null>(() => {
    if (initialTaskSlug) {
      return contentStore.getWritingTask(initialTaskSlug) || null;
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | WritingCategory>('All');
  const [selectedTaskType, setSelectedTaskType] = useState<'All' | WritingTaskType>('All');
  const [selectedSubType, setSelectedSubType] = useState<string>('All');

  const tasks = contentStore.getWritingTasks();

  const subTypes = ['All', ...Array.from(new Set(tasks.map((t) => t.subType)))];

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || t.category === selectedCategory;
    const matchesType =
      selectedTaskType === 'All' || t.taskType === selectedTaskType;
    const matchesSubType =
      selectedSubType === 'All' || t.subType === selectedSubType;
    return matchesSearch && matchesCategory && matchesType && matchesSubType;
  });

  if (selectedTask) {
    return (
      <WritingPractice
        task={selectedTask}
        onBack={() => setSelectedTask(null)}
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
              IELTS Writing Suite: Task 1 & Task 2
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Writing Practice Studio
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
          Practice official essays, letters, and visual infographics with live word count, suggested time constraints, and multi-criteria band evaluation.
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
              placeholder="Search prompts by question keywords or topic..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Module Selector Pill Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategory('academic')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === 'academic'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Academic
              </button>
              <button
                onClick={() => setSelectedCategory('general')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedCategory === 'general'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                General Training
              </button>
            </div>
          </div>
        </div>

        {/* Task Type Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400 mr-1">Task Type:</span>
          {(['All', 'task1', 'task2'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedTaskType(type)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                selectedTaskType === type
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {type === 'All' ? 'All Tasks' : type === 'task1' ? 'Task 1 (Summary/Letter)' : 'Task 2 (Essay)'}
            </button>
          ))}

          {/* Subtype Dropdown */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">Format:</span>
            <select
              value={selectedSubType}
              onChange={(e) => setSelectedSubType(e.target.value)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              {subTypes.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Writing Tasks Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>{filteredTasks.length} IELTS Tasks Available</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            AI Line-by-Line Diagnostics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 shadow-xs hover:border-red-400/80 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white">
                      {task.taskType === 'task1' ? 'Task 1' : 'Task 2'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {task.category === 'academic' ? 'Academic' : 'General'}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    {task.subType}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors leading-snug">
                  {task.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {task.prompt}
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.suggestedTimeMinutes} mins recommended</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-red-600 dark:text-red-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Min {task.minWordCount} words</span>
                  </span>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  onClick={() => setSelectedTask(task)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-red-600 text-white dark:bg-slate-800 dark:hover:bg-red-600 shadow-xs transition-colors"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Start Writing Task</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
