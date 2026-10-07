import React from 'react';
import {
  Award,
  BookOpen,
  Headphones,
  PenTool,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const bandDescriptors = [
    { band: 'Band 9.0', level: 'Expert User', desc: 'Has fully operational command of the language: appropriate, accurate and fluent with complete understanding.' },
    { band: 'Band 8.0', level: 'Very Good User', desc: 'Has fully operational command with only occasional unsystematic inaccuracies and inappropriacies.' },
    { band: 'Band 7.0', level: 'Good User', desc: 'Has operational command of the language, though with occasional inaccuracies, inappropriacies and misunderstandings in some situations.' },
    { band: 'Band 6.0', level: 'Competent User', desc: 'Has generally effective command of the language despite some inaccuracies, inappropriacies and misunderstandings. Can use and understand fairly complex language.' },
    { band: 'Band 5.0', level: 'Modest User', desc: 'Has partial command of the language, coping with overall meaning in most situations, though is likely to make many mistakes.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-4 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
          Official Academic Standards
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
          About IELTS Practice Hub
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          A dedicated preparatory system designed to replicate official computer-delivered IELTS conditions for self-directed students aiming for Band 7.0 to Band 9.0.
        </p>
      </div>

      {/* Module Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] space-y-3">
          <BookOpen className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reading Module</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            3 passages, 40 total questions in the full exam (approx. 20 minutes per passage). Tests skimming, scanning, argument mapping, and detailed factual comprehension.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] space-y-3">
          <Headphones className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Listening Module</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            4 recorded sections, 40 questions. Section 1 social transaction; Section 2 monologue; Section 3 academic discussion; Section 4 university lecture.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] space-y-3">
          <PenTool className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Writing Module</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Task 1 (min 150 words, 20 mins): Summarize visual data or letter. Task 2 (min 250 words, 40 mins): Formal discursive essay. Evaluated across 4 equal criteria.
          </p>
        </div>
      </div>

      {/* Official Band Scale Reference */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f17] p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-red-600" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Official IELTS 9-Band Descriptors Reference
          </h3>
        </div>

        <div className="space-y-3">
          {bandDescriptors.map((item) => (
            <div
              key={item.band}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-20 text-sm font-black text-red-600 dark:text-red-400">
                  {item.band}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {item.level}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 sm:max-w-lg leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
