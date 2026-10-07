import React, { useState } from 'react';
import { contentStore, MediaItem } from '../services/contentStore';
import {
  ReadingTopic,
  ListeningTest,
  ListeningPart,
  WritingTask,
  DifficultyLevel,
  WritingCategory,
  WritingTaskType,
} from '../types';
import {
  ShieldCheck,
  BookOpen,
  Headphones,
  PenTool,
  Image as ImageIcon,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  RotateCw,
  CheckCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Layers,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reading' | 'listening' | 'writing' | 'media' | 'settings'>('reading');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Lists
  const [readingTopics, setReadingTopics] = useState(contentStore.getReadingTopics());
  const [listeningTests, setListeningTests] = useState(contentStore.getListeningTests());
  const [writingTasks, setWritingTasks] = useState(contentStore.getWritingTasks());
  const [mediaItems, setMediaItems] = useState(contentStore.getMediaItems());

  // Editing state for Reading
  const [editingReading, setEditingReading] = useState<Partial<ReadingTopic> | null>(null);
  // Editing state for Listening
  const [editingListening, setEditingListening] = useState<Partial<ListeningTest> | null>(null);
  const [activeAdminPartTab, setActiveAdminPartTab] = useState<number>(0);
  // Editing state for Writing
  const [editingWriting, setEditingWriting] = useState<Partial<WritingTask> | null>(null);
  // Adding Media
  const [newMedia, setNewMedia] = useState<{ name: string; type: 'audio' | 'image' | 'diagram'; url: string }>({
    name: '',
    type: 'audio',
    url: '',
  });

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // --- Reading Handlers ---
  const handleSaveReading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReading?.title || !editingReading?.category) return;

    const topicToSave: ReadingTopic = {
      id: editingReading.id || 'read-' + Date.now(),
      slug: (editingReading.slug || editingReading.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
      title: editingReading.title,
      category: editingReading.category || 'General',
      difficulty: (editingReading.difficulty as DifficultyLevel) || 'Intermediate',
      summary: editingReading.summary || 'Comprehensive practice passage.',
      durationMinutes: editingReading.durationMinutes || 20,
      passage: editingReading.passage || {
        title: editingReading.title,
        paragraphs: [
          {
            id: 'p1',
            label: 'A',
            text: 'This is the newly added passage text for administrative content testing.',
          },
        ],
      },
      questions: editingReading.questions || [
        {
          id: 'rq-' + Date.now(),
          number: 1,
          type: 'multiple_choice',
          prompt: 'What is the primary topic discussed in the passage?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswers: ['Option A'],
          explanation: {
            whyCorrect: 'Confirmed directly in paragraph A.',
            whyIncorrect: 'Other options lack textual backing.',
            passageCitation: 'Paragraph A',
            paragraphId: 'p1',
            clueText: 'primary topic',
            skillTested: 'Identifying main thesis',
            mistakeCategory: 'Misunderstood question',
          },
        },
      ],
    };

    contentStore.saveReadingTopic(topicToSave);
    setReadingTopics(contentStore.getReadingTopics());
    setEditingReading(null);
    showToast('Reading topic saved successfully!');
  };

  const handleDeleteReading = (id: string) => {
    if (confirm('Delete this reading topic permanently?')) {
      contentStore.deleteReadingTopic(id);
      setReadingTopics(contentStore.getReadingTopics());
      showToast('Reading topic deleted.');
    }
  };

  // --- Listening Handlers ---
  const handleSaveListening = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListening?.title) return;

    // Ensure 4 parts are present
    const existingParts = editingListening.parts || [];
    const partsToSave = existingParts.length > 0 ? existingParts : [
      {
        id: (editingListening.id || 'list-' + Date.now()) + '-p1',
        partNumber: 1 as const,
        title: 'Part 1: Social Consultation',
        situation: editingListening.situation || editingListening.topic || 'Social Dialogue',
        durationMinutes: 2.5,
        durationSeconds: 155,
        audioScript: editingListening.audioScript || 'Part 1 conversation dialogue transcript...',
        questions: [],
      },
      {
        id: (editingListening.id || 'list-' + Date.now()) + '-p2',
        partNumber: 2 as const,
        title: 'Part 2: Community Monologue',
        situation: 'Community overview and public guidance',
        durationMinutes: 2.5,
        durationSeconds: 150,
        audioScript: 'Part 2 monologue speech transcript...',
        questions: [],
      },
      {
        id: (editingListening.id || 'list-' + Date.now()) + '-p3',
        partNumber: 3 as const,
        title: 'Part 3: Academic Discussion',
        situation: 'University student academic debate',
        durationMinutes: 2.5,
        durationSeconds: 155,
        audioScript: 'Part 3 academic discussion transcript...',
        questions: [],
      },
      {
        id: (editingListening.id || 'list-' + Date.now()) + '-p4',
        partNumber: 4 as const,
        title: 'Part 4: Academic Lecture',
        situation: 'Scholarly lecture and research presentation',
        durationMinutes: 2.5,
        durationSeconds: 150,
        audioScript: 'Part 4 academic lecture transcript...',
        questions: [],
      },
    ];

    const totalSeconds = partsToSave.reduce((acc, p) => acc + (p.durationSeconds || 150), 0);

    const testToSave: ListeningTest = {
      id: editingListening.id || 'list-' + Date.now(),
      slug: editingListening.slug || editingListening.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: editingListening.title,
      topic: editingListening.topic || editingListening.title,
      description: editingListening.description || editingListening.situation || 'Comprehensive IELTS listening practice test.',
      section: (editingListening.section as any) || 1,
      situation: editingListening.situation || editingListening.topic || 'IELTS Listening practice test.',
      difficulty: (editingListening.difficulty as DifficultyLevel) || 'Intermediate',
      durationMinutes: Math.round(totalSeconds / 60) || 10,
      totalDurationSeconds: totalSeconds,
      audioUrl: editingListening.audioUrl || '',
      audioScript: editingListening.audioScript || partsToSave[0]?.audioScript || '',
      published: editingListening.published !== false,
      parts: partsToSave,
      questions: partsToSave.flatMap((p) => p.questions),
    };

    contentStore.saveListeningTest(testToSave);
    setListeningTests(contentStore.getListeningTests());
    setEditingListening(null);
    showToast('Listening test saved successfully!');
  };

  const handleTogglePublishListening = (id: string) => {
    const target = listeningTests.find((t) => t.id === id);
    if (!target) return;
    const updated: ListeningTest = {
      ...target,
      published: target.published === false ? true : false,
    };
    contentStore.saveListeningTest(updated);
    setListeningTests(contentStore.getListeningTests());
    showToast(`Test ${updated.published ? 'published' : 'unpublished'} successfully!`);
  };

  const handleDeleteListening = (id: string) => {
    if (confirm('Delete this listening test permanently?')) {
      contentStore.deleteListeningTest(id);
      setListeningTests(contentStore.getListeningTests());
      showToast('Listening test deleted.');
    }
  };

  // --- Writing Handlers ---
  const handleSaveWriting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWriting?.title || !editingWriting?.prompt) return;

    const taskToSave: WritingTask = {
      id: editingWriting.id || 'w-' + Date.now(),
      slug: editingWriting.slug || editingWriting.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: editingWriting.title,
      category: editingWriting.category || 'academic',
      taskType: editingWriting.taskType || 'task2',
      subType: editingWriting.subType || 'Opinion Essay',
      difficulty: editingWriting.difficulty || 'Intermediate',
      prompt: editingWriting.prompt,
      instructions: editingWriting.instructions || 'Give reasons for your answer and include relevant examples. Write at least 250 words.',
      suggestedTimeMinutes: editingWriting.suggestedTimeMinutes || 40,
      minWordCount: editingWriting.minWordCount || 250,
      modelAnswer: editingWriting.modelAnswer,
    };

    contentStore.saveWritingTask(taskToSave);
    setWritingTasks(contentStore.getWritingTasks());
    setEditingWriting(null);
    showToast('Writing task saved successfully!');
  };

  const handleDeleteWriting = (id: string) => {
    if (confirm('Delete this writing task permanently?')) {
      contentStore.deleteWritingTask(id);
      setWritingTasks(contentStore.getWritingTasks());
      showToast('Writing task deleted.');
    }
  };

  // --- Media Handlers ---
  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.name || !newMedia.url) return;

    const item: MediaItem = {
      id: 'med-' + Date.now(),
      name: newMedia.name,
      type: newMedia.type,
      url: newMedia.url,
      createdAt: new Date().toISOString(),
    };

    contentStore.saveMediaItem(item);
    setMediaItems(contentStore.getMediaItems());
    setNewMedia({ name: '', type: 'audio', url: '' });
    showToast('Media item added to storage catalog!');
  };

  const handleDeleteMedia = (id: string) => {
    contentStore.deleteMediaItem(id);
    setMediaItems(contentStore.getMediaItems());
    showToast('Media item deleted.');
  };

  // Reset to default seed
  const handleResetDefaults = () => {
    if (confirm('Reset all content back to factory demo defaults? Custom admin changes will be refreshed.')) {
      contentStore.resetToDefaults();
      setReadingTopics(contentStore.getReadingTopics());
      setListeningTests(contentStore.getListeningTests());
      setWritingTasks(contentStore.getWritingTasks());
      showToast('Content database restored to initial seed state.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold border border-red-500 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Administrative Control Suite
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Content & System Management
          </h1>
        </div>

        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Factory Seed Data</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('reading')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'reading'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Reading Topics ({readingTopics.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listening')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'listening'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Listening Tests ({listeningTests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('writing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'writing'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>Writing Tasks ({writingTasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'media'
              ? 'bg-red-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Audio & Media Library ({mediaItems.length})</span>
        </button>
      </div>

      {/* --- TAB 1: READING MANAGEMENT --- */}
      {activeTab === 'reading' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Manage Reading Passages & Topics
            </h3>
            <button
              onClick={() =>
                setEditingReading({
                  title: '',
                  category: 'Environment',
                  difficulty: 'Intermediate',
                  durationMinutes: 20,
                  summary: '',
                })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Reading Topic</span>
            </button>
          </div>

          {/* Edit / Create Form Modal */}
          {editingReading && (
            <form
              onSubmit={handleSaveReading}
              className="p-6 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20 space-y-4"
            >
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingReading.id ? 'Edit Reading Topic' : 'Create New Reading Topic'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingReading.title || ''}
                    onChange={(e) => setEditingReading({ ...editingReading, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={editingReading.category || ''}
                    onChange={(e) => setEditingReading({ ...editingReading, category: e.target.value })}
                    placeholder="e.g. Technology, Science, History"
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={editingReading.difficulty || 'Intermediate'}
                    onChange={(e) => setEditingReading({ ...editingReading, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="IELTS Exam Level">IELTS Exam Level</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={editingReading.durationMinutes || 20}
                    onChange={(e) => setEditingReading({ ...editingReading, durationMinutes: parseInt(e.target.value) || 20 })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">Summary Description</label>
                <textarea
                  value={editingReading.summary || ''}
                  onChange={(e) => setEditingReading({ ...editingReading, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs h-16"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingReading(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700"
                >
                  Save Reading Topic
                </button>
              </div>
            </form>
          )}

          {/* Reading Topic Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">Topic Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Difficulty</th>
                  <th className="p-3">Questions</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {readingTopics.map((topic) => (
                  <tr key={topic.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      {topic.title}
                    </td>
                    <td className="p-3 text-slate-500">{topic.category}</td>
                    <td className="p-3 text-slate-500">{topic.difficulty}</td>
                    <td className="p-3 text-slate-500">{topic.questions.length} items</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingReading(topic)}
                          className="p-1 text-slate-500 hover:text-red-600"
                          title="Edit Topic"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteReading(topic.id)}
                          className="p-1 text-slate-400 hover:text-red-600"
                          title="Delete Topic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 2: LISTENING MANAGEMENT --- */}
      {activeTab === 'listening' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Manage Listening Tests (~10-Minute Multi-Part System)
              </h3>
              <p className="text-xs text-slate-500">
                Configure 4-part tests, dynamic or uploaded audio, scripts, and question banks.
              </p>
            </div>
            <button
              onClick={() => {
                const newParts: any[] = [
                  {
                    id: 'p1-' + Date.now(),
                    partNumber: 1,
                    title: 'Part 1: Social Dialogue',
                    situation: 'Conversation in a social or transactional context',
                    durationMinutes: 2.5,
                    durationSeconds: 155,
                    audioScript: 'Man: Good morning, how can I help you today?\nWoman: Hello, I would like to make an inquiry...',
                    questions: [
                      {
                        id: 'q1-' + Date.now(),
                        number: 1,
                        type: 'form_completion',
                        prompt: 'Customer Name: __________',
                        instructions: 'Write ONE WORD only.',
                        correctAnswers: ['thompson'],
                        explanation: {
                          whyCorrect: 'The speaker spells out the surname clearly.',
                          timestamp: '0:42',
                          importantClue: 'Surname spelled T-H-O-M-P-S-O-N',
                          vocabularyNote: 'Surname dictation',
                          mistakeCategory: 'Spelling mistake',
                        },
                      },
                    ],
                  },
                  {
                    id: 'p2-' + Date.now(),
                    partNumber: 2,
                    title: 'Part 2: Community Guide',
                    situation: 'Monologue providing public service information',
                    durationMinutes: 2.5,
                    durationSeconds: 150,
                    audioScript: 'Speaker: Welcome everyone to today\'s orientation on community services...',
                    questions: [],
                  },
                  {
                    id: 'p3-' + Date.now(),
                    partNumber: 3,
                    title: 'Part 3: Academic Discussion',
                    situation: 'Discussion between university students and their tutor',
                    durationMinutes: 2.5,
                    durationSeconds: 155,
                    audioScript: 'Tutor: How is your group research project progressing so far?',
                    questions: [],
                  },
                  {
                    id: 'p4-' + Date.now(),
                    partNumber: 4,
                    title: 'Part 4: Academic Lecture',
                    situation: 'University lecture on scientific research',
                    durationMinutes: 2.5,
                    durationSeconds: 150,
                    audioScript: 'Lecturer: Good morning class. Today we turn to our main topic: marine ecosystem restoration...',
                    questions: [],
                  },
                ];

                setEditingListening({
                  title: 'New Practice Test',
                  topic: 'General Academic',
                  section: 1,
                  difficulty: 'Intermediate',
                  durationMinutes: 10,
                  totalDurationSeconds: 610,
                  situation: 'Official IELTS 4-part listening simulation',
                  audioUrl: '',
                  audioScript: '',
                  published: true,
                  parts: newParts,
                });
                setActiveAdminPartTab(0);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Listening Test</span>
            </button>
          </div>

          {editingListening && (() => {
            const currentParts: ListeningPart[] = editingListening.parts && editingListening.parts.length === 4
              ? (editingListening.parts as ListeningPart[])
              : [
                  { id: 'p1', partNumber: 1 as const, title: 'Part 1', situation: '', durationMinutes: 2.5, durationSeconds: 155, audioUrl: '', audioScript: '', questions: [] },
                  { id: 'p2', partNumber: 2 as const, title: 'Part 2', situation: '', durationMinutes: 2.5, durationSeconds: 150, audioUrl: '', audioScript: '', questions: [] },
                  { id: 'p3', partNumber: 3 as const, title: 'Part 3', situation: '', durationMinutes: 2.5, durationSeconds: 155, audioUrl: '', audioScript: '', questions: [] },
                  { id: 'p4', partNumber: 4 as const, title: 'Part 4', situation: '', durationMinutes: 2.5, durationSeconds: 150, audioUrl: '', audioScript: '', questions: [] },
                ];

            const activePart = currentParts[activeAdminPartTab] || currentParts[0];

            const updateActivePart = (updatedPartFields: Partial<typeof activePart>) => {
              const updatedParts = [...currentParts];
              updatedParts[activeAdminPartTab] = {
                ...updatedParts[activeAdminPartTab],
                ...updatedPartFields,
              };
              setEditingListening({
                ...editingListening,
                parts: updatedParts,
              });
            };

            const handleAddQuestionToActivePart = () => {
              const existingQ = activePart.questions || [];
              const nextNumber = existingQ.length + 1 + (activeAdminPartTab * 10);
              const newQ: any = {
                id: 'lq-' + Date.now(),
                number: nextNumber,
                type: 'form_completion',
                prompt: 'Answer detail: __________',
                instructions: 'Write NO MORE THAN TWO WORDS.',
                correctAnswers: ['answer'],
                explanation: {
                  whyCorrect: 'Stated by the speaker in the audio dialogue.',
                  timestamp: '1:15',
                  importantClue: 'Key keyword mentioned in sentence',
                  vocabularyNote: 'Standard lexical resource',
                  mistakeCategory: 'Spelling mistake',
                },
              };
              updateActivePart({
                questions: [...existingQ, newQ],
              });
            };

            const handleRemoveQuestion = (qIndex: number) => {
              const existingQ = [...(activePart.questions || [])];
              existingQ.splice(qIndex, 1);
              updateActivePart({ questions: existingQ });
            };

            const handleUpdateQuestion = (qIndex: number, fields: any) => {
              const existingQ = [...(activePart.questions || [])];
              existingQ[qIndex] = { ...existingQ[qIndex], ...fields };
              updateActivePart({ questions: existingQ });
            };

            return (
              <form
                onSubmit={handleSaveListening}
                className="p-6 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20 space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                    <span>{editingListening.id ? 'Edit Listening Test' : 'Create New Listening Test'}</span>
                  </h4>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingListening.published !== false}
                        onChange={(e) => setEditingListening({ ...editingListening, published: e.target.checked })}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span className="text-slate-700 dark:text-slate-300">
                        {editingListening.published !== false ? 'Published (Live)' : 'Draft (Unpublished)'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Overall Test Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Test Title</label>
                    <input
                      type="text"
                      required
                      value={editingListening.title || ''}
                      onChange={(e) => setEditingListening({ ...editingListening, title: e.target.value })}
                      placeholder="e.g. Booking a Hotel Room"
                      className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Topic Category</label>
                    <input
                      type="text"
                      value={editingListening.topic || ''}
                      onChange={(e) => setEditingListening({ ...editingListening, topic: e.target.value })}
                      placeholder="e.g. Hotel Reservation & Travel"
                      className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
                    <select
                      value={editingListening.difficulty || 'Intermediate'}
                      onChange={(e) => setEditingListening({ ...editingListening, difficulty: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="IELTS Exam Level">IELTS Exam Level</option>
                    </select>
                  </div>
                </div>

                {/* Parts Selector Tabs */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Sections Breakdown (Parts 1 to 4 — ~10 Min Total)
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Active: Part {activeAdminPartTab + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[0, 1, 2, 3].map((pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setActiveAdminPartTab(pIdx)}
                        className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                          activeAdminPartTab === pIdx
                            ? 'border-red-600 bg-red-600 text-white font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span>Part {pIdx + 1}</span>
                          <span className={activeAdminPartTab === pIdx ? 'text-red-200' : 'text-slate-400'}>
                            {currentParts[pIdx]?.questions?.length || 0} Qs
                          </span>
                        </div>
                        <div className="truncate text-[10px] mt-0.5 opacity-90">
                          {currentParts[pIdx]?.title || `Part ${pIdx + 1}`}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Active Part Configuration */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Part {activeAdminPartTab + 1} Title
                        </label>
                        <input
                          type="text"
                          value={activePart.title || ''}
                          onChange={(e) => updateActivePart({ title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Audio URL (Optional MP3 / CDN / Leave empty for Synthesizer)
                        </label>
                        <input
                          type="url"
                          value={activePart.audioUrl || ''}
                          onChange={(e) => updateActivePart({ audioUrl: e.target.value })}
                          placeholder="https://... (Uses clean SpeechSynthesizer if empty)"
                          className="w-full px-3 py-2 rounded-lg border bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Part {activeAdminPartTab + 1} Audio Script / Full Transcript
                      </label>
                      <textarea
                        value={activePart.transcript || activePart.audioScript || ''}
                        onChange={(e) => updateActivePart({ transcript: e.target.value, audioScript: e.target.value })}
                        placeholder="Enter full dialogue text with speaker tags. The synthesizer uses this to voice the test..."
                        className="w-full px-3 py-2 rounded-lg border bg-stone-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px] h-28 leading-relaxed"
                      />
                    </div>

                    {/* Questions in this part */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Questions for Part {activeAdminPartTab + 1} ({activePart.questions?.length || 0})
                        </span>
                        <button
                          type="button"
                          onClick={handleAddQuestionToActivePart}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-stone-200 border border-slate-200 dark:border-slate-700"
                        >
                          <Plus className="w-3.5 h-3.5 text-red-600" />
                          <span>Add Question</span>
                        </button>
                      </div>

                      {activePart.questions && activePart.questions.length > 0 ? (
                        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                          {activePart.questions.map((q: any, qIdx: number) => (
                            <div
                              key={q.id || qIdx}
                              className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-800/40 space-y-2 text-xs"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-red-600 dark:text-red-400">
                                  Q{q.number || qIdx + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                  <select
                                    value={q.type}
                                    onChange={(e) => handleUpdateQuestion(qIdx, { type: e.target.value })}
                                    className="px-2 py-1 rounded border text-[11px] bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                  >
                                    <option value="form_completion">Form Completion</option>
                                    <option value="multiple_choice">Multiple Choice</option>
                                    <option value="matching">Matching</option>
                                    <option value="note_completion">Note Completion</option>
                                    <option value="table_completion">Table Completion</option>
                                    <option value="short_answer">Short Answer</option>
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveQuestion(qIdx)}
                                    className="text-slate-400 hover:text-red-600 p-1"
                                    title="Delete question"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] text-slate-500 mb-0.5">Prompt / Sentence</label>
                                <input
                                  type="text"
                                  value={q.prompt || ''}
                                  onChange={(e) => handleUpdateQuestion(qIdx, { prompt: e.target.value })}
                                  className="w-full px-2.5 py-1.5 rounded border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[11px] text-slate-500 mb-0.5">Correct Answer(s)</label>
                                  <input
                                    type="text"
                                    value={Array.isArray(q.correctAnswers) ? q.correctAnswers.join(', ') : q.correctAnswers || ''}
                                    onChange={(e) =>
                                      handleUpdateQuestion(qIdx, {
                                        correctAnswers: e.target.value.split(',').map((s) => s.trim()),
                                      })
                                    }
                                    placeholder="e.g. 15, fifteen"
                                    className="w-full px-2.5 py-1.5 rounded border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] text-slate-500 mb-0.5">Audio Timestamp</label>
                                  <input
                                    type="text"
                                    value={q.explanation?.timestamp || ''}
                                    onChange={(e) =>
                                      handleUpdateQuestion(qIdx, {
                                        explanation: { ...q.explanation, timestamp: e.target.value },
                                      })
                                    }
                                    placeholder="e.g. 1:15"
                                    className="w-full px-2.5 py-1.5 rounded border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-xs text-slate-400 bg-stone-50 dark:bg-slate-800/20 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                          No questions created for this part yet. Click &quot;Add Question&quot; above.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingListening(null)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 shadow-sm"
                  >
                    Save Complete Listening Test
                  </button>
                </div>
              </form>
            );
          })()}

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">Title & Topic</th>
                  <th className="p-3">Sections & Duration</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Audio Source</th>
                  <th className="p-3">Questions</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {listeningTests.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="p-3 max-w-xs">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">
                        {t.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {t.topic || 'IELTS Listening'} &bull; <span className="font-mono text-red-600 dark:text-red-400">/{t.slug}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-500">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {t.parts?.length || 4} Parts
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        ~{Math.round((t.totalDurationSeconds || 610) / 60)}:00 mins
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.published !== false
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                        }`}
                      >
                        {t.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">
                      {t.audioUrl || t.parts?.some((p) => p.audioUrl) ? 'MP3 / Audio' : 'Multi-Part Synthesizer'}
                    </td>
                    <td className="p-3 text-slate-500">
                      {(t.questions?.length ?? t.parts?.reduce((acc, p) => acc + (p.questions?.length || 0), 0)) ?? 0} items
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleTogglePublishListening(t.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            t.published !== false
                              ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-slate-200 dark:border-slate-800'
                              : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 border-slate-200 dark:border-slate-800'
                          }`}
                          title={t.published !== false ? 'Unpublish Test' : 'Publish Test'}
                        >
                          {t.published !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingListening(t);
                            setActiveAdminPartTab(0);
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Test"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteListening(t.id)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete Test"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 3: WRITING MANAGEMENT --- */}
      {activeTab === 'writing' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Manage Writing Tasks (Task 1 & Task 2)
            </h3>
            <button
              onClick={() =>
                setEditingWriting({
                  title: '',
                  category: 'academic',
                  taskType: 'task2',
                  subType: 'Opinion Essay',
                  difficulty: 'Intermediate',
                  prompt: '',
                  instructions: 'Give reasons for your answer. Write at least 250 words.',
                  suggestedTimeMinutes: 40,
                  minWordCount: 250,
                })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Writing Task</span>
            </button>
          </div>

          {editingWriting && (
            <form
              onSubmit={handleSaveWriting}
              className="p-6 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20 space-y-4"
            >
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingWriting.id ? 'Edit Writing Task' : 'Create New Writing Task'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingWriting.title || ''}
                    onChange={(e) => setEditingWriting({ ...editingWriting, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Track</label>
                  <select
                    value={editingWriting.category || 'academic'}
                    onChange={(e) => setEditingWriting({ ...editingWriting, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="academic">Academic</option>
                    <option value="general">General Training</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Task Type</label>
                  <select
                    value={editingWriting.taskType || 'task2'}
                    onChange={(e) =>
                      setEditingWriting({
                        ...editingWriting,
                        taskType: e.target.value as any,
                        minWordCount: e.target.value === 'task1' ? 150 : 250,
                        suggestedTimeMinutes: e.target.value === 'task1' ? 20 : 40,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="task1">Task 1 (Report / Letter, min 150 words)</option>
                    <option value="task2">Task 2 (Essay, min 250 words)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sub-Type</label>
                  <input
                    type="text"
                    value={editingWriting.subType || ''}
                    onChange={(e) => setEditingWriting({ ...editingWriting, subType: e.target.value })}
                    placeholder="e.g. Bar Chart, Opinion Essay, Formal Letter"
                    className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">Task Prompt</label>
                <textarea
                  required
                  value={editingWriting.prompt || ''}
                  onChange={(e) => setEditingWriting({ ...editingWriting, prompt: e.target.value })}
                  placeholder="Official prompt statement..."
                  className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs h-20"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditingWriting(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700"
                >
                  Save Writing Task
                </button>
              </div>
            </form>
          )}

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Min Words</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {writingTasks.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      {w.title}
                    </td>
                    <td className="p-3 text-slate-500 uppercase">{w.taskType} ({w.category})</td>
                    <td className="p-3 text-slate-500">{w.subType}</td>
                    <td className="p-3 text-slate-500">{w.minWordCount} words</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingWriting(w)}
                          className="p-1 text-slate-500 hover:text-red-600"
                          title="Edit Task"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteWriting(w.id)}
                          className="p-1 text-slate-400 hover:text-red-600"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 4: MEDIA & AUDIO LIBRARY --- */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Media & Storage Catalog
            </h3>
          </div>

          <form
            onSubmit={handleAddMedia}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] space-y-3"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Register New Media Asset / Audio URL
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                required
                placeholder="Asset display label..."
                value={newMedia.name}
                onChange={(e) => setNewMedia({ ...newMedia, name: e.target.value })}
                className="px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <select
                value={newMedia.type}
                onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value as any })}
                className="px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="audio">Audio Track (MP3 / WAV)</option>
                <option value="diagram">Chart / Diagram Image</option>
                <option value="image">Passage Photography</option>
              </select>
              <input
                type="url"
                required
                placeholder="Direct HTTPS URL..."
                value={newMedia.url}
                onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                className="px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700"
            >
              Add Asset to Catalog
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] flex items-center justify-between"
              >
                <div className="space-y-0.5 max-w-[200px] truncate">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                    {item.name}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-red-600">
                    {item.type}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-400 hover:underline flex items-center gap-1 truncate"
                  >
                    <span>{item.url}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteMedia(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600"
                  title="Remove Asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
