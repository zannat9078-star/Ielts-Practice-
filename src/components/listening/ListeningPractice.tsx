import React, { useState, useEffect } from 'react';
import { ListeningTest, ListeningQuestion } from '../../types';
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(test.durationMinutes * 60);
  const [timerActive, setTimerActive] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);

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

  const questions = test.questions;
  const currentQuestion: ListeningQuestion | undefined = questions[currentQuestionIndex];

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
    const unansweredCount = questions.filter((q) => !answers[q.id]?.trim()).length;
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

    questions.forEach((q) => {
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

    const accuracy = Math.round((correctCount / questions.length) * 100);
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
        maxScore: questions.length,
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
    questions.forEach((q) => {
      const userAns = (answers[q.id] || '').trim().toLowerCase();
      const isCorrect = q.correctAnswers.some((ca) => ca.trim().toLowerCase() === userAns);
      if (!isCorrect) {
        const cat = q.explanation.mistakeCategory;
        mistakeCounts[cat] = (mistakeCounts[cat] || 0) + 1;
      }
    });
  }

  const correctTotal = questions.filter((q) =>
    q.correctAnswers.some((ca) => ca.trim().toLowerCase() === (answers[q.id] || '').trim().toLowerCase())
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Top Test Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-red-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Listening Library</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
            Section {test.section}
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">{test.difficulty}</span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              timeRemainingSeconds < 300 && !isSubmitted
                ? 'bg-red-50 dark:bg-red-950/60 text-red-600 border-red-400 animate-pulse'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-red-500" />
            <span>{isSubmitted ? 'Completed' : `Time: ${formatTimer(timeRemainingSeconds)}`}</span>
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

      {/* DEDICATED AUDIO PLAYER AT TOP: Independent from collapsible questions */}
      <AudioPlayer
        audioUrl={test.audioUrl}
        audioScript={test.audioScript}
        testTitle={test.title}
        sectionNumber={test.section}
      />

      {/* Main Practice Body or Results */}
      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Context Panel: Situation description & Instructions (4 Cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-5 space-y-4 shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 dark:text-red-400">
                Exam Situation
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {test.title}
              </h3>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong className="block text-slate-800 dark:text-slate-200 mb-1">Context:</strong>
              {test.situation}
            </div>

            <div className="p-3 bg-red-50/60 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30 text-xs text-red-800 dark:text-red-300">
              <strong className="block font-bold mb-1">Listening Strategy:</strong>
              Answer the questions as you listen. In the actual IELTS exam, you will hear the recording ONCE only. Check spelling carefully.
            </div>

            {/* Quick navigator summary */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 block mb-2">Question Status</span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {questions.map((q, idx) => {
                  const hasAnswer = !!answers[q.id]?.trim();
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`p-1.5 rounded-lg font-bold border transition-colors ${
                        idx === currentQuestionIndex
                          ? 'border-red-600 bg-red-600 text-white'
                          : hasAnswer
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      Q{q.number}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right / Questions Panel (8 Cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] shadow-xs overflow-hidden flex flex-col min-h-[500px]">
            {/* Question Top Header */}
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
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md transition-colors ${
                    flagged[currentQuestion.id]
                      ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border border-amber-300'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{flagged[currentQuestion.id] ? 'Flagged' : 'Flag'}</span>
                </button>
              )}
            </div>

            {/* Question Body */}
            {currentQuestion && (
              <div className="p-6 flex-1 space-y-5">
                {currentQuestion.instructions && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
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
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
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

                {/* Text / Gap fill answer */}
                {!currentQuestion.options && (
                  <div className="space-y-2 pt-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Write missing word(s) heard in audio:
                    </label>
                    <input
                      type="text"
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleSelectAnswer(currentQuestion.id, e.target.value)}
                      placeholder="Type verbatim words from audio..."
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
                <span>Previous</span>
              </button>

              <button
                disabled={currentQuestionIndex === questions.length - 1}
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))
                }
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white disabled:opacity-30 hover:bg-red-700"
              >
                <span>Next</span>
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
                  Listening Test Completed
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Test Duration Used: {Math.floor(timeSpentSeconds / 60)}m {timeSpentSeconds % 60}s
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex flex-col items-center justify-center font-black shadow-lg shadow-red-600/30">
                  <span className="text-2xl leading-none">
                    {correctTotal}/{questions.length}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80">Correct</span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase text-slate-400 block">Listening Band</span>
                  <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                    Band {correctTotal >= 3 ? '8.0' : correctTotal >= 2 ? '7.0' : '6.0'}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Accuracy: {Math.round((correctTotal / questions.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <span className="text-xs font-bold text-emerald-600 block">Correct Answers</span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">{correctTotal}</span>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/30">
                <span className="text-xs font-bold text-red-600 block">Mistakes</span>
                <span className="text-xl font-black text-red-700 dark:text-red-400">{questions.length - correctTotal}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 block">Total Items</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-200">{questions.length}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 block">Target Aim</span>
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
                      <span className="text-[11px] text-amber-600 font-semibold">{count} error(s) detected</span>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question Breakdown with Audio Timestamps and Clues */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-red-500" />
              <span>Audio Clues & Detailed Diagnostic Explanations</span>
            </h4>

            {questions.map((q) => {
              const userAns = (answers[q.id] || '').trim();
              const isCorrect = q.correctAnswers.some(
                (ca) => ca.trim().toLowerCase() === userAns.toLowerCase()
              );

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${
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
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 text-emerald-900 dark:text-emerald-200'
                          : 'bg-red-50/50 dark:bg-red-950/20 border-red-200 text-red-900 dark:text-red-200'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                        Your Answer:
                      </span>
                      <span className="font-bold text-sm">{userAns || '(Unanswered)'}</span>
                    </div>

                    <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200">
                      <span className="block text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                        Correct Answer:
                      </span>
                      <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        {q.correctAnswers[0]}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 space-y-2 text-xs leading-relaxed">
                    <div>
                      <strong className="text-emerald-700 dark:text-emerald-400 block mb-0.5">
                        Correct Reasoning:
                      </strong>
                      <p className="text-slate-700 dark:text-slate-300">{q.explanation.whyCorrect}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Important Clue: </span>
                        <code className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">
                          {q.explanation.importantClue}
                        </code>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Vocabulary / Phonetic Note: </span>
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
                setTimeRemainingSeconds(test.durationMinutes * 60);
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
