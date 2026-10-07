import {
  ReadingTopic,
  ListeningTest,
  WritingTask,
  PracticeAttempt,
  WritingEvaluation,
  UserProgress,
} from '../types';
import { SEED_READING_TOPICS, SEED_LISTENING_TESTS, SEED_WRITING_TASKS } from '../data/seedData';

const STORAGE_KEYS = {
  READING: 'ielts_hub_reading_topics_v1',
  LISTENING: 'ielts_hub_listening_tests_v2',
  WRITING: 'ielts_hub_writing_tasks_v1',
  ATTEMPTS: 'ielts_hub_practice_attempts_v1',
  EVALUATIONS: 'ielts_hub_writing_evals_v1',
  MEDIA: 'ielts_hub_media_library_v1',
};

export interface MediaItem {
  id: string;
  name: string;
  type: 'audio' | 'image' | 'diagram';
  url: string;
  description?: string;
  size?: string;
  createdAt: string;
}

class ContentStore {
  private readingTopics: ReadingTopic[] = [];
  private listeningTests: ListeningTest[] = [];
  private writingTasks: WritingTask[] = [];
  private mediaItems: MediaItem[] = [];

  constructor() {
    this.init();
  }

  private isClient(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private init() {
    if (!this.isClient()) {
      this.readingTopics = [...SEED_READING_TOPICS];
      this.listeningTests = [...SEED_LISTENING_TESTS];
      this.writingTasks = [...SEED_WRITING_TASKS];
      return;
    }

    try {
      const storedReading = localStorage.getItem(STORAGE_KEYS.READING);
      this.readingTopics = storedReading ? JSON.parse(storedReading) : [...SEED_READING_TOPICS];

      const storedListening = localStorage.getItem(STORAGE_KEYS.LISTENING);
      if (storedListening) {
        try {
          const parsed = JSON.parse(storedListening);
          // Ensure all 10 tests exist with 4 parts and complete ~10-minute duration
          if (
            Array.isArray(parsed) &&
            parsed.length >= 10 &&
            parsed.every((t) => t.parts && t.parts.length === 4 && (t.totalDurationSeconds || 0) >= 500 && t.audioUrl)
          ) {
            this.listeningTests = parsed;
          } else {
            this.listeningTests = [...SEED_LISTENING_TESTS];
            this.persistListening();
          }
        } catch {
          this.listeningTests = [...SEED_LISTENING_TESTS];
          this.persistListening();
        }
      } else {
        this.listeningTests = [...SEED_LISTENING_TESTS];
        this.persistListening();
      }

      const storedWriting = localStorage.getItem(STORAGE_KEYS.WRITING);
      this.writingTasks = storedWriting ? JSON.parse(storedWriting) : [...SEED_WRITING_TASKS];

      const storedMedia = localStorage.getItem(STORAGE_KEYS.MEDIA);
      this.mediaItems = storedMedia
        ? JSON.parse(storedMedia)
        : [
            {
              id: 'med-01',
              name: 'Sample IELTS Listening Chime',
              type: 'audio',
              url: 'https://cdn.freesound.org/previews/250/250629_4486188-lq.mp3',
              description: 'Official test start announcement chime',
              size: '48 KB',
              createdAt: new Date().toISOString(),
            },
            {
              id: 'med-02',
              name: 'Bar Chart Sample SVG',
              type: 'diagram',
              url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
              description: 'Renewable energy chart graphic',
              size: '112 KB',
              createdAt: new Date().toISOString(),
            },
          ];
    } catch {
      this.readingTopics = [...SEED_READING_TOPICS];
      this.listeningTests = [...SEED_LISTENING_TESTS];
      this.writingTasks = [...SEED_WRITING_TASKS];
    }
  }

  // --- Reading Operations ---
  public getReadingTopics(): ReadingTopic[] {
    return [...this.readingTopics];
  }

  public getReadingTopic(idOrSlug: string): ReadingTopic | undefined {
    return this.readingTopics.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
  }

  public saveReadingTopic(topic: ReadingTopic): void {
    const index = this.readingTopics.findIndex((t) => t.id === topic.id);
    if (index >= 0) {
      this.readingTopics[index] = topic;
    } else {
      this.readingTopics.unshift(topic);
    }
    this.persistReading();
  }

  public deleteReadingTopic(id: string): void {
    this.readingTopics = this.readingTopics.filter((t) => t.id !== id);
    this.persistReading();
  }

  private persistReading(): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.READING, JSON.stringify(this.readingTopics));
    }
  }

  // --- Listening Operations ---
  public getListeningTests(): ListeningTest[] {
    return [...this.listeningTests];
  }

  public getListeningTest(idOrSlug: string): ListeningTest | undefined {
    const clean = idOrSlug.toLowerCase().trim();
    const test = this.listeningTests.find(
      (t) =>
        t.id.toLowerCase() === clean ||
        t.slug.toLowerCase() === clean ||
        clean === t.slug.replace(/^test-0?/, 'test-') ||
        clean.replace(/^test-0?/, 'test-') === t.slug.replace(/^test-0?/, 'test-')
    );
    if (test && test.parts && (!test.questions || test.questions.length === 0)) {
      test.questions = test.parts.flatMap((p) => p.questions);
    }
    return test;
  }

  public saveListeningTest(test: ListeningTest): void {
    const index = this.listeningTests.findIndex((t) => t.id === test.id);
    if (index >= 0) {
      this.listeningTests[index] = test;
    } else {
      this.listeningTests.unshift(test);
    }
    this.persistListening();
  }

  public deleteListeningTest(id: string): void {
    this.listeningTests = this.listeningTests.filter((t) => t.id !== id);
    this.persistListening();
  }

  private persistListening(): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.LISTENING, JSON.stringify(this.listeningTests));
    }
  }

  // --- Writing Operations ---
  public getWritingTasks(): WritingTask[] {
    return [...this.writingTasks];
  }

  public getWritingTask(idOrSlug: string): WritingTask | undefined {
    return this.writingTasks.find((w) => w.id === idOrSlug || w.slug === idOrSlug);
  }

  public saveWritingTask(task: WritingTask): void {
    const index = this.writingTasks.findIndex((t) => t.id === task.id);
    if (index >= 0) {
      this.writingTasks[index] = task;
    } else {
      this.writingTasks.unshift(task);
    }
    this.persistWriting();
  }

  public deleteWritingTask(id: string): void {
    this.writingTasks = this.writingTasks.filter((t) => t.id !== id);
    this.persistWriting();
  }

  private persistWriting(): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.WRITING, JSON.stringify(this.writingTasks));
    }
  }

  // --- Media Library ---
  public getMediaItems(): MediaItem[] {
    return [...this.mediaItems];
  }

  public saveMediaItem(item: MediaItem): void {
    const index = this.mediaItems.findIndex((m) => m.id === item.id);
    if (index >= 0) {
      this.mediaItems[index] = item;
    } else {
      this.mediaItems.unshift(item);
    }
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(this.mediaItems));
    }
  }

  public deleteMediaItem(id: string): void {
    this.mediaItems = this.mediaItems.filter((m) => m.id !== id);
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(this.mediaItems));
    }
  }

  // --- Practice Attempts & Progress ---
  public recordAttempt(attempt: PracticeAttempt): void {
    if (!this.isClient()) return;
    const all = this.getAllAttempts();
    all.unshift(attempt);
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(all));
  }

  public getAllAttempts(): PracticeAttempt[] {
    if (!this.isClient()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public getUserAttempts(userId: string): PracticeAttempt[] {
    return this.getAllAttempts().filter((a) => a.userId === userId);
  }

  public saveWritingEvaluation(evaluation: WritingEvaluation): void {
    if (!this.isClient()) return;
    const evals = this.getAllWritingEvaluations();
    evals.unshift(evaluation);
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evals));
  }

  public getAllWritingEvaluations(): WritingEvaluation[] {
    if (!this.isClient()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public getUserProgress(userId: string): UserProgress {
    const attempts = this.getUserAttempts(userId);
    const readingAttempts = attempts.filter((a) => a.module === 'reading');
    const listeningAttempts = attempts.filter((a) => a.module === 'listening');
    const writingAttempts = attempts.filter((a) => a.module === 'writing');

    const totalSeconds = attempts.reduce((acc, curr) => acc + (curr.timeSpentSeconds || 0), 0);

    const calcAvg = (list: PracticeAttempt[]) => {
      if (list.length === 0) return 0;
      const sum = list.reduce((acc, item) => acc + item.estimatedBand, 0);
      return Math.round((sum / list.length) * 10) / 10;
    };

    const readingBand = calcAvg(readingAttempts) || 6.5;
    const listeningBand = calcAvg(listeningAttempts) || 6.5;
    const writingBand = calcAvg(writingAttempts) || 6.0;

    const overallBand = Math.round(((readingBand + listeningBand + writingBand) / 3) * 2) / 2;

    const mistakeFrequency: Record<string, number> = {};
    attempts.forEach((att) => {
      att.mistakes?.forEach((m) => {
        const cat = m.category || 'General error';
        mistakeFrequency[cat] = (mistakeFrequency[cat] || 0) + 1;
      });
    });

    return {
      readingCompleted: readingAttempts.length,
      listeningCompleted: listeningAttempts.length,
      writingCompleted: writingAttempts.length,
      totalTimeMinutes: Math.round(totalSeconds / 60),
      readingBandAverage: readingBand,
      listeningBandAverage: listeningBand,
      writingBandAverage: writingBand,
      overallBandAverage: overallBand || 6.5,
      attempts,
      mistakeFrequency,
    };
  }

  // Restore factory seed data
  public resetToDefaults(): void {
    this.readingTopics = [...SEED_READING_TOPICS];
    this.listeningTests = [...SEED_LISTENING_TESTS];
    this.writingTasks = [...SEED_WRITING_TASKS];
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.READING, JSON.stringify(this.readingTopics));
      localStorage.setItem(STORAGE_KEYS.LISTENING, JSON.stringify(this.listeningTests));
      localStorage.setItem(STORAGE_KEYS.WRITING, JSON.stringify(this.writingTasks));
    }
  }
}

export const contentStore = new ContentStore();
