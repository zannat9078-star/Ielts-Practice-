export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  targetBandScore: number;
  examDate?: string;
  createdAt: string;
}

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'IELTS Exam Level';

export type MistakeCategory =
  | 'Misunderstood question'
  | 'Vocabulary problem'
  | 'Distractor confusion'
  | 'Distractor mistake'
  | 'Failed to locate information'
  | 'Incorrect inference'
  | 'Grammar misunderstanding'
  | 'Spelling mistake'
  | 'Reading too quickly'
  | 'Keyword mismatch'
  | 'Missed keyword'
  | 'Matching Headings mistake'
  | 'Missed transition'
  | 'Fast speech difficulty'
  | 'Number confusion'
  | 'Name/place confusion'
  | 'Wrong prediction'
  | 'Lost concentration'
  | string;

export type ReadingQuestionType =
  | 'multiple_choice'
  | 'multiple_answers'
  | 'true_false_not_given'
  | 'yes_no_not_given'
  | 'matching_headings'
  | 'matching_information'
  | 'matching_features'
  | 'sentence_completion'
  | 'summary_completion'
  | 'note_completion'
  | 'table_completion'
  | 'flow_chart_completion'
  | 'short_answer';

export interface ReadingParagraph {
  id: string;
  label: string; // 'A', 'B', 'C', etc.
  text: string;
}

export interface ReadingQuestion {
  id: string;
  number: number;
  type: ReadingQuestionType;
  prompt: string;
  instructions?: string;
  options?: string[]; // for multiple choice
  headings?: { id: string; text: string }[]; // for matching headings
  tableHeaders?: string[];
  tableRows?: string[][];
  correctAnswers: string[]; // lowercase trimmed comparison
  explanation: {
    whyCorrect: string;
    whyIncorrect: string;
    passageCitation: string;
    paragraphId: string;
    clueText: string;
    skillTested: string;
    mistakeCategory: MistakeCategory;
  };
}

export interface ReadingTopic {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  summary: string;
  durationMinutes: number;
  passage: {
    title: string;
    subtitle?: string;
    paragraphs: ReadingParagraph[];
  };
  questions: ReadingQuestion[];
}

export type ListeningQuestionType =
  | 'multiple_choice'
  | 'multiple_answers'
  | 'form_completion'
  | 'note_completion'
  | 'table_completion'
  | 'sentence_completion'
  | 'matching'
  | 'map_labelling'
  | 'short_answer';

export interface ListeningQuestion {
  id: string;
  number: number;
  type: ListeningQuestionType;
  prompt: string;
  instructions?: string;
  options?: string[];
  correctAnswers: string[];
  explanation: {
    whyCorrect: string;
    whyIncorrect?: string;
    timestamp: string;
    importantClue: string;
    vocabularyNote: string;
    mistakeCategory: MistakeCategory;
  };
}

export interface ListeningTest {
  id: string;
  slug: string;
  title: string;
  section: 1 | 2 | 3 | 4;
  situation: string; // e.g., 'Conversation between receptionist and guest'
  difficulty: DifficultyLevel;
  durationMinutes: number;
  audioUrl?: string; // external or fallback
  audioScript: string;
  questions: ListeningQuestion[];
}

export type WritingCategory = 'academic' | 'general';
export type WritingTaskType = 'task1' | 'task2';

export interface WritingTask {
  id: string;
  slug: string;
  title: string;
  category: WritingCategory;
  taskType: WritingTaskType;
  subType: string; // e.g. 'Bar Chart', 'Opinion Essay', 'Formal Letter'
  difficulty: DifficultyLevel;
  prompt: string;
  instructions: string;
  suggestedTimeMinutes: number;
  minWordCount: number;
  visualChartType?: 'bar' | 'line' | 'pie' | 'table' | 'process' | 'map';
  visualChartData?: {
    labels: string[];
    series: { name: string; values: number[]; color?: string }[];
    notes?: string;
  };
  modelAnswer?: string;
}

export interface WritingGrammarIssue {
  original: string;
  problem: string;
  correction: string;
  explanation: string;
  category: string;
}

export interface WritingEvaluation {
  id: string;
  taskId: string;
  submittedAt: string;
  studentText: string;
  wordCount: number;
  characterCount: number;
  estimatedBand: number;
  scores: {
    taskAchievement: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammaticalRange: number;
  };
  strengths: string[];
  weaknesses: string[];
  grammarMistakes: WritingGrammarIssue[];
  vocabularyIssues: {
    original: string;
    problem: string;
    suggestion: string;
  }[];
  improvedVersion: string;
  generalFeedback: string;
}

export interface PracticeAttempt {
  id: string;
  userId: string;
  module: 'reading' | 'listening' | 'writing';
  itemId: string;
  itemTitle: string;
  score: number;
  maxScore: number;
  accuracy: number;
  estimatedBand: number;
  timeSpentSeconds: number;
  completedAt: string;
  mistakes: {
    questionNumber?: number;
    questionId?: string;
    category: MistakeCategory | string;
    userAnswer: string;
    correctAnswer: string;
  }[];
}

export interface UserProgress {
  readingCompleted: number;
  listeningCompleted: number;
  writingCompleted: number;
  totalTimeMinutes: number;
  readingBandAverage: number;
  listeningBandAverage: number;
  writingBandAverage: number;
  overallBandAverage: number;
  attempts: PracticeAttempt[];
  mistakeFrequency: Record<string, number>;
}
