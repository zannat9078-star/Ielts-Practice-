import React, { useState, useEffect } from 'react';
import { ListeningTest, ListeningQuestion, ListeningPart } from '../../types';
import { AudioPlayer } from './AudioPlayer';
import { contentStore } from '../../services/contentStore';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  XCircle,
  Headphones,
  RotateCcw,
  Volume2,
  AlertTriangle,
  Lightbulb,
  FileCheck,
  Target,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ListeningPracticeProps {
  test: ListeningTest;
  onBack: () => void;
  onPracticeWeakArea?: (category: string) => void;
}

export const ListeningPractice: React.FC<ListeningPracticeProps> = ({
  test,
  onBack,
  onPracticeWeakArea,
}) => {
  const { user } = useAuth();
  const [activePartIndex, setActivePartIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(
    (test.durationMinutes || 10) * 60
  );
  const [timerActive, setTimerActive] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);

  // Flatten all questions across all 4 parts
  const allQuestions: ListeningQuestion[] =
    test.parts && test.parts.length > 0
      ? test.parts.flatMap((p) => p.questions)
      : test.questions || [];

  const currentQuestion: ListeningQuestion | undefined = allQuestions[currentQuestionIndex];

  // Current active part
  const activePart: ListeningPart | undefined = test.parts?.[activePartIndex] || test.parts?.[0];

  useEffect(() => {
    let interval: any = null;
    if (timerActive && !isSubmitted && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds((prev) => prev - 1);
        setTimeSpentSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isSubmitted, timeRemainingSeconds]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (qId: string, val: string) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const toggleFlag = (qId: string) => {
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmit = () => {
    const unansweredCount = allQuestions.filter((q) => !answers[q.id]?.trim()).length;
    if (unansweredCount > 0) {
      const confirmSubmit = confirm(
        `You have ${unansweredCount} unanswered question(s). Are you sure you want to finalize and submit your test?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitted(true);
    setTimerActive(false);

    let correctCount = 0;
    const mistakes: any[] = [];

    allQuestions.forEach((q) => {
      const userAns = (answers[q.id] || '').trim().toLowerCase();
      const isCorrect = q.correctAnswers.some(
        (ca) => ca.trim().toLowerCase() === userAns
      );

      if (isCorrect) {
        correctCount++;
      } else {
        mistakes.push({
          questionNumber: q.number,
          questionId: q.id,
          category: q.explanation.mistakeCategory,
          userAnswer: answers[q.id] || '(unanswered)',
          correctAnswer: q.correctAnswers[0],
        });
      }
    });

    const accuracy = Math.round((correctCount / Math.max(1, allQuestions.length)) * 100);
    let band = 5.0;
    if (accuracy >= 90) band = 8.5;
    else if (accuracy >= 80) band = 7.5;
    else if (accuracy >= 70) band = 7.0;
    else if (accuracy >= 60) band = 6.5;
    else if (accuracy >= 50) band = 6.0;

    if (user) {
      contentStore.recordAttempt({
        id: 'att-list-' + Date.now(),
        userId: user.id,
        module: 'listening',
        itemId: test.id,
        itemTitle: test.title,
        score: correctCount,
        maxScore: allQuestions.length,
        accuracy,
        estimatedBand: band,
        timeSpentSeconds,
        completedAt: new Date().toISOString(),
        mistakes,
      });
    }
  };

  const mistakeCounts: Record<string, number> = {};
  if (isSubmitted) {
    allQuestions.forEach((q) => {
      const userAns = (answers[q.id] || '').trim().toLowerCase();
      const isCorrect = q.correctAnswers.some(
        (ca) => ca.trim().toLowerCase() === userAns
      );
      if (!isCorrect) {
        const cat = q.explanation.mistakeCategory;
        mistakeCounts[cat] = (mistakeCounts[cat] || 0) + 1;
      }
    });
  }

  const correctTotal = allQuestions.filter((q) =>
    q.correctAnswers.some(
      (ca) => ca.trim().toLowerCase() === (answers[q.id] || '').trim().toLowerCase()
    )
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Top Test Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Listening Library</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
            {test.topic || `Test ${test.slug.replace('test-', '')}`}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            {test.difficulty} • Full 10-Minute Examination
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border transition-colors ${
              timeRemainingSeconds < 300 && !isSubmitted
                ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-400 animate-pulse'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-red-500" />
            <span>{isSubmitted ? 'Completed' : `Exam Timer: ${formatTimer(timeRemainingSeconds)}`}</span>
          </div>

          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
            >
              Submit Test
            </button>
          )}
        </div>
      </div>

      {/* IELTS Test Structure Roadmap */}
      <div className="p-3 rounded-xl bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto gap-1 text-[11px] font-bold pb-1 pt-0.5">
          <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <span className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 text-[10px] flex items-center justify-center font-bold">1</span>
            <span>Introduction</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          {[1, 2, 3, 4].map((pNum) => {
            const isCurPart = !isSubmitted && activePartIndex === pNum - 1;
            return (
              <React.Fragment key={pNum}>
                <button
                  onClick={() => {
                    if (!isSubmitted) {
                      setActivePartIndex(pNum - 1);
                      const firstQ = allQuestions.findIndex((q) =>
                        test.parts?.[pNum - 1]?.questions.some((pq) => pq.id === q.id)
                      );
                      if (firstQ >= 0) setCurrentQuestionIndex(firstQ);
                    }
                  }}
                  className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-md transition-colors ${
                    isCurPart
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${isCurPart ? 'bg-white text-red-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    {pNum + 1}
                  </span>
                  <span>Part {pNum}</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </React.Fragment>
            );
          })}

          <div
            className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-md transition-colors ${
              isSubmitted
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${isSubmitted ? 'bg-white text-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
              6
            </span>
            <span>{isSubmitted ? 'Result & Mistake Analysis' : 'Final Submit'}</span>
          </div>
        </div>
      </div>

      {/* DEDICATED INDEPENDENT AUDIO PLAYER (Parts 1-4, ~10:00 Duration, Independent from Question accordions) */}
      <AudioPlayer
        testId={test.id}
        parts={test.parts || []}
        activePartIndex={activePartIndex}
        onPartChange={(idx) => setActivePartIndex(idx)}
        testTitle={test.title}
        audioUrl={test.audioUrl}
        audioScript={test.audioScript}
        sectionNumber={test.section}
      />

      {/* Main Practice Body or Results */}
      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Part Navigation & Situation Details (4 Cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-5 space-y-4 shadow-xs">
            {/* Parts Selector Tabs */}
            {test.parts && test.parts.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                  IELTS Listening Parts (4 Sections)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {test.parts.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePartIndex(idx);
                        // Jump to first question of this part
                        const firstQOfPart = allQuestions.findIndex((q) =>
                          p.questions.some((pq) => pq.id === q.id)
                        );
                        if (firstQOfPart >= 0) setCurrentQuestionIndex(firstQOfPart);
                      }}
                      className={`p-2 rounded-xl text-left border text-xs font-bold transition-all ${
                        activePartIndex === idx
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="block text-[10px] uppercase text-red-500">Part {p.partNumber}</span>
                      <span className="block truncate text-[11px] font-semibold">{p.title.replace(/^Part \d+:\s*/, '')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="block text-slate-800 dark:text-slate-200 mb-1 font-bold">
                {activePart?.title || test.title}:
              </strong>
              {activePart?.situation || test.situation || test.description}
            </div>

            <div className="p-3 bg-red-50/60 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/40 text-xs text-red-800 dark:text-red-300">
              <strong className="block font-bold mb-1">Official Exam Instructions:</strong>
              Answer the questions as you listen. The recording will play continuously across Parts 1 to 4 for approximately 10 minutes.
            </div>

            {/* Questions Navigator Grid */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Question Status</span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {Object.keys(answers).length} of {allQuestions.length} Answered
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {allQuestions.map((q, idx) => {
                  const hasAnswer = !!answers[q.id]?.trim();
                  const isCur = idx === currentQuestionIndex;
                  const isFlag = !!flagged[q.id];
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`p-2 rounded-lg font-bold border transition-all relative ${
                        isCur
                          ? 'border-red-600 bg-red-600 text-white shadow-xs'
                          : hasAnswer
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Q{q.number}
                      {isFlag && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Question Card (8 Cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] shadow-xs overflow-hidden flex flex-col min-h-[500px]">
            {/* Question Header */}
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                  {currentQuestion?.number}
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Type: {currentQuestion?.type.replace(/_/g, ' ')}
                </span>
              </div>

              {currentQuestion && (
                <button
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                    flagged[currentQuestion.id]
                      ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{flagged[currentQuestion.id] ? 'Flagged' : 'Flag Question'}</span>
                </button>
              )}
            </div>

            {/* Question Body */}
            {currentQuestion && (
              <div className="p-6 flex-1 space-y-5">
                {currentQuestion.instructions && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                    {currentQuestion.instructions}
                  </div>
                )}

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQuestion.prompt}
                </h3>

                {/* Multiple choice options */}
                {currentQuestion.options && (
                  <div className="space-y-2.5 pt-2">
                    {currentQuestion.options.map((opt) => {
                      const isSelected = answers[currentQuestion.id] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectAnswer(currentQuestion.id, opt)}
                          className={`w-full text-left p-3.5 rounded-xl text-xs sm:text-sm font-medium border transition-all flex items-start gap-3 ${
                            isSelected
                              ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200 shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                              isSelected
                                ? 'border-red-600 bg-red-600 text-white'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Text / Gap fill input */}
                {!currentQuestion.options && (
                  <div className="space-y-2 pt-3">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Write your extracted answer heard in audio:
                    </label>
                    <input
                      type="text"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleSelectAnswer(currentQuestion.id, e.target.value)}
                      placeholder="Type verbatim word(s) or numbers..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Bottom Navigator Controls */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Question</span>
              </button>

              <button
                disabled={currentQuestionIndex === allQuestions.length - 1}
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.min(allQuestions.length - 1, prev + 1))
                }
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white disabled:opacity-30 hover:bg-red-700"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Listening Result & Error Analysis Page */
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Score Header */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                  IELTS Listening Examination Result
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Time Used: {Math.floor(timeSpentSeconds / 60)}m {timeSpentSeconds % 60}s • 4 Examination Parts Completed
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex flex-col items-center justify-center font-black shadow-lg shadow-red-600/30">
                  <span className="text-2xl leading-none">
                    {correctTotal}/{allQuestions.length}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80">Correct</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 block">Listening Band</span>
                  <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                    Band {correctTotal >= 8 ? '8.5' : correctTotal >= 7 ? '7.5' : correctTotal >= 5 ? '6.5' : '5.5'}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    Accuracy: {Math.round((correctTotal / Math.max(1, allQuestions.length)) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">Correct Answers</span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">{correctTotal}</span>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/30">
                <span className="text-xs font-bold text-red-600 dark:text-red-400 block">Mistakes</span>
                <span className="text-xl font-black text-red-700 dark:text-red-300">{allQuestions.length - correctTotal}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Total Items</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-200">{allQuestions.length}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Target Aim</span>
                <span className="text-xl font-black text-red-600 dark:text-red-400">
                  {user?.targetBandScore || '7.5'}
                </span>
              </div>
            </div>
          </div>

          {/* Listening Mistake Analysis */}
          {Object.keys(mistakeCounts).length > 0 && (
            <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-amber-200/60 dark:border-amber-900/40">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Listening Mistake Analysis & Acoustic Traps
                  </h4>
                </div>
                <button
                  onClick={() => onPracticeWeakArea && onPracticeWeakArea(Object.keys(mistakeCounts)[0])}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
                >
                  Practice My Weak Areas
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(mistakeCounts).map(([cat, count]) => (
                  <div
                    key={cat}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{cat}</span>
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">{count} error(s) detected</span>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center">
                      {count}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-amber-900 dark:text-amber-300/90 leading-relaxed">
                Recommendation: Practice focusing on acoustic signpost words (such as "However", "In contrast", and "Actually") to avoid distractor trap answers.
              </p>
            </div>
          )}

          {/* Question Breakdown with Audio Timestamps and Clues */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-red-500" />
              <span>Question-by-Question Acoustic Breakdown</span>
            </h4>

            {allQuestions.map((q) => {
              const userAns = (answers[q.id] || '').trim();
              const isCorrect = q.correctAnswers.some(
                (ca) => ca.trim().toLowerCase() === userAns.toLowerCase()
              );

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border p-5 sm:p-6 space-y-4 transition-all ${
                    isCorrect
                      ? 'border-emerald-200 dark:border-emerald-950 bg-white dark:bg-[#0c0f17]'
                      : 'border-red-200 dark:border-red-950 bg-white dark:bg-[#0c0f17]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}
                      >
                        {q.number}
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {q.type.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                        Timestamp: {q.explanation.timestamp}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isCorrect
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                        }`}
                      >
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                    {q.prompt}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div
                      className={`p-3 rounded-xl border ${
                        isCorrect
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
                          : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                        Your Answer:
                      </span>
                      <span className="font-bold text-sm">{userAns || '(Unanswered)'}</span>
                    </div>

                    <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200">
                      <span className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                        Correct Answer:
                      </span>
                      <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        {q.correctAnswers[0]}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 space-y-2 text-xs leading-relaxed">
                    <div>
                      <strong className="text-emerald-700 dark:text-emerald-400 block mb-0.5 font-bold">
                        Correct Reasoning:
                      </strong>
                      <p className="text-slate-700 dark:text-slate-300">{q.explanation.whyCorrect}</p>
                    </div>

                    {!isCorrect && q.explanation.whyIncorrect && (
                      <div>
                        <strong className="text-red-600 dark:text-red-400 block mb-0.5 font-bold">
                          Why You Made This Mistake:
                        </strong>
                        <p className="text-slate-700 dark:text-slate-300">{q.explanation.whyIncorrect}</p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Important Audio Clue: </span>
                        <code className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">
                          {q.explanation.importantClue}
                        </code>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Listening Skill Tested: </span>
                        <span className="text-slate-600 dark:text-slate-400">{q.explanation.vocabularyNote}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setAnswers({});
                setTimeRemainingSeconds((test.durationMinutes || 10) * 60);
                setTimeSpentSeconds(0);
                setTimerActive(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Listening Test</span>
            </button>

            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
            >
              Back to Listening Library
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
