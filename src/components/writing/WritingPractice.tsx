import React, { useState, useEffect } from 'react';
import { WritingTask, WritingEvaluation } from '../../types';
import { evaluateWritingTask } from '../../services/aiEvaluator';
import { contentStore } from '../../services/contentStore';
import { useAuth } from '../../context/AuthContext';
import { VisualChart } from './VisualChart';
import {
  Clock,
  Send,
  Save,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  Sparkles,
  ChevronLeft,
  BookOpen,
  Award,
} from 'lucide-react';

interface WritingPracticeProps {
  task: WritingTask;
  onBack: () => void;
}

export const WritingPractice: React.FC<WritingPracticeProps> = ({ task, onBack }) => {
  const { user } = useAuth();
  const draftKey = `ielts_writing_draft_${task.id}`;

  const [text, setText] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(draftKey) || '';
    }
    return '';
  });

  const [secondsRemaining, setSecondsRemaining] = useState(task.suggestedTimeMinutes * 60);
  const [timerActive, setTimerActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(null);
  const [draftSavedToast, setDraftSavedToast] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Live counters
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const characterCount = text.length;
  const minWords = task.minWordCount;
  const isWordCountMet = wordCount >= minWords;

  // Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (timerActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, secondsRemaining]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(draftKey, text);
      setDraftSavedToast(true);
      setTimeout(() => setDraftSavedToast(false), 2500);
    }
  };

  const handleSubmit = async () => {
    if (wordCount < 30) {
      alert('Please write at least 30 words before submitting for IELTS evaluation.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await evaluateWritingTask(task, text);
      setEvaluation(result);
      setTimerActive(false);

      // Record in content store
      contentStore.saveWritingEvaluation(result);
      if (user) {
        contentStore.recordAttempt({
          id: 'att-' + Date.now(),
          userId: user.id,
          module: 'writing',
          itemId: task.id,
          itemTitle: task.title,
          score: Math.round(result.estimatedBand * 10),
          maxScore: 90,
          accuracy: Math.round((result.estimatedBand / 9) * 100),
          estimatedBand: result.estimatedBand,
          timeSpentSeconds: task.suggestedTimeMinutes * 60 - secondsRemaining,
          completedAt: new Date().toISOString(),
          mistakes: result.grammarMistakes.map((g) => ({
            category: g.category,
            userAnswer: g.original,
            correctAnswer: g.correction,
          })),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (confirm('Start a fresh submission? Your draft text will be cleared.')) {
      setText('');
      setEvaluation(null);
      setSecondsRemaining(task.suggestedTimeMinutes * 60);
      setTimerActive(true);
      localStorage.removeItem(draftKey);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Navigation bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Writing Library</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Live Timer Pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold border transition-colors ${
              secondsRemaining < 300
                ? 'bg-red-50 dark:bg-red-950/60 text-red-600 border-red-300 dark:border-red-800 animate-pulse'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-red-500" />
            <span>Time Remaining: {formatTimer(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setTimerActive(!timerActive)}
            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white underline"
          >
            {timerActive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Main Grid: Prompt and Editor */}
      {!evaluation ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Task Prompt & Guidance (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-red-600 text-white">
                  {task.taskType === 'task1' ? 'IELTS Task 1' : 'IELTS Task 2'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {task.category === 'academic' ? 'Academic' : 'General Training'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  {task.subType}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {task.title}
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/70 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Official Prompt
                </h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-line">
                  {task.prompt}
                </p>
              </div>

              <div className="p-3 bg-red-50/60 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30 text-xs text-red-800 dark:text-red-300 leading-relaxed">
                <strong className="block font-bold mb-1">Official Instruction:</strong>
                {task.instructions}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Recommended Time</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{task.suggestedTimeMinutes} Minutes</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Minimum Length</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">{task.minWordCount} Words</span>
                </div>
              </div>
            </div>

            {/* Visual Diagram for Academic Task 1 if present */}
            {task.taskType === 'task1' && (
              <VisualChart task={task} />
            )}
          </div>

          {/* Right: Distraction-free Writing Area (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] shadow-sm overflow-hidden flex flex-col">
              {/* Editor Top Bar with Live Word Counts */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Student Writing Space
                  </span>
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isWordCountMet
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    <span>Words: {wordCount} / {minWords}</span>
                    {isWordCountMet ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    {characterCount} chars
                  </span>
                  <button
                    onClick={handleSaveDraft}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Draft</span>
                  </button>
                </div>
              </div>

              {/* Text Area */}
              <div className="p-4 sm:p-5 flex-1 min-h-[380px]">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Begin your IELTS ${task.taskType === 'task1' ? 'Task 1 summary' : 'Task 2 essay'} here...\n\nAim to write with clear paragraph divisions (Introduction, Overview/Body 1, Body 2, Conclusion).`}
                  className="w-full h-80 sm:h-96 resize-y bg-transparent text-slate-900 dark:text-slate-100 font-passage text-base leading-relaxed focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>

              {/* Editor Bottom Bar */}
              <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {draftSavedToast && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium animate-fade">
                      ✓ Draft successfully saved locally
                    </span>
                  )}
                  {!draftSavedToast && (
                    <span>Auto-draft saved locally • Press submit when ready for diagnostic report</span>
                  )}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white shadow-md shadow-red-600/20 transition-all active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing IELTS Rubrics...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit for IELTS Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Evaluation & Diagnostic Feedback Result Page */
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Score Banner */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 sm:p-8 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                  Official IELTS Band Diagnostic Report
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Submitted on {new Date(evaluation.submittedAt).toLocaleTimeString()} • {evaluation.wordCount} words written
                </p>
              </div>

              {/* Estimated Overall Band Card */}
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex flex-col items-center justify-center font-black shadow-lg shadow-red-600/30">
                  <span className="text-2xl leading-none">{evaluation.estimatedBand.toFixed(1)}</span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80">Band</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 block">Performance Tier</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                    {evaluation.estimatedBand >= 7.5
                      ? 'Good to Very Good User'
                      : evaluation.estimatedBand >= 6.5
                      ? 'Competent Academic User'
                      : 'Modest User / Needs Review'}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Target Band: {user?.targetBandScore || 7.0}
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Official IELTS Criteria Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Task Achievement</span>
                  <span className="text-sm font-black text-red-600">{evaluation.scores.taskAchievement.toFixed(1)}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600" style={{ width: `${(evaluation.scores.taskAchievement / 9) * 100}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 pt-1">Addressing prompt, overview, and data accuracy</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Coherence & Cohesion</span>
                  <span className="text-sm font-black text-red-600">{evaluation.scores.coherenceCohesion.toFixed(1)}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600" style={{ width: `${(evaluation.scores.coherenceCohesion / 9) * 100}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 pt-1">Paragraph progression and logical transition devices</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Lexical Resource</span>
                  <span className="text-sm font-black text-red-600">{evaluation.scores.lexicalResource.toFixed(1)}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600" style={{ width: `${(evaluation.scores.lexicalResource / 9) * 100}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 pt-1">Vocabulary range, formal register, and collocations</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Grammar & Accuracy</span>
                  <span className="text-sm font-black text-red-600">{evaluation.scores.grammaticalRange.toFixed(1)}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600" style={{ width: `${(evaluation.scores.grammaticalRange / 9) * 100}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 pt-1">Syntactic complexity, agreements, and punctuation</p>
              </div>
            </div>

            {/* General Feedback Quote */}
            <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border-l-4 border-red-600 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
              "{evaluation.generalFeedback}"
            </div>
          </div>

          {/* Strengths & Weaknesses Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>Demonstrated Strengths</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {evaluation.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Key Weaknesses to Improve</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {evaluation.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Line-by-Line Highlighted Error Diagnostics */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-red-500" />
                <span>Line-by-Line Error Detection & Corrections</span>
              </h4>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {evaluation.grammarMistakes.length} Issues Identified
              </span>
            </div>

            {evaluation.grammarMistakes.length === 0 ? (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 italic py-2">
                No high-frequency structural errors flagged in your submission! Outstanding grammatical precision.
              </p>
            ) : (
              <div className="space-y-3">
                {evaluation.grammarMistakes.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 px-2 py-0.5 rounded">
                        Category: {issue.category}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">Issue #{idx + 1}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-2.5 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
                        <span className="block text-[10px] font-bold uppercase text-red-500">Your Original:</span>
                        <code className="text-xs font-mono font-semibold text-red-700 dark:text-red-300">
                          "{issue.original}"
                        </code>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{issue.problem}</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                        <span className="block text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                          Recommended Correction:
                        </span>
                        <code className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                          "{issue.correction}"
                        </code>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{issue.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Improved Rewritten Version Preserving Ideas */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Band 8.0+ Model Rewrite (Preserving Your Authentic Meaning)</span>
            </h4>
            <p className="text-xs text-slate-500">
              Notice how your ideas and points remain intact, while vocabulary register and syntax are polished according to Cambridge standards.
            </p>
            <div className="p-5 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 font-passage text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {evaluation.improvedVersion}
            </div>
          </div>

          {/* Model Answer Toggle if available */}
          {task.modelAnswer && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-red-500" />
                  <span>Official Examiner Model Answer (Band 9.0)</span>
                </h4>
                <button
                  onClick={() => setShowModelAnswer(!showModelAnswer)}
                  className="px-3 py-1 text-xs font-bold rounded-lg border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  {showModelAnswer ? 'Hide Model Answer' : 'Reveal Model Answer'}
                </button>
              </div>

              {showModelAnswer && (
                <div className="p-5 bg-red-50/40 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30 font-passage text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line animate-in fade-in">
                  {task.modelAnswer}
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Practice This Task Again</span>
            </button>

            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Back to Writing Tasks Library
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
