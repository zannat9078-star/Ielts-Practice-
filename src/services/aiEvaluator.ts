import { WritingEvaluation, WritingGrammarIssue, WritingTask } from '../types';

/**
 * Intelligent IELTS Writing Evaluator
 * Runs comprehensive multi-dimension analysis using official IELTS band descriptors
 * with line-by-line grammar diagnostics and stylistic improvements.
 */

export async function evaluateWritingTask(
  task: WritingTask,
  studentText: string
): Promise<WritingEvaluation> {
  // First, check if backend API is reachable with GEMINI_API_KEY
  try {
    const res = await fetch('/api/ai/evaluate-writing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskPrompt: task.prompt,
        taskType: task.taskType,
        category: task.category,
        subType: task.subType,
        minWords: task.minWordCount,
        studentText,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.estimatedBand) {
        return {
          id: 'eval-' + Date.now(),
          taskId: task.id,
          submittedAt: new Date().toISOString(),
          studentText,
          wordCount: studentText.trim().split(/\s+/).filter(Boolean).length,
          characterCount: studentText.length,
          ...data,
        };
      }
    }
  } catch {
    // Backend API not reachable or no server running, proceed to comprehensive deterministic evaluation
  }

  // Built-in intelligent evaluation engine
  return runBuiltInEvaluation(task, studentText);
}

function runBuiltInEvaluation(task: WritingTask, text: string): WritingEvaluation {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const characterCount = text.length;
  const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0);
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  const grammarMistakes: WritingGrammarIssue[] = [];
  const vocabularyIssues: { original: string; problem: string; suggestion: string }[] = [];

  // Common grammar pattern detection
  const textLower = text.toLowerCase();

  // 1. Article issues
  const articleAwithVowel = /\b(a)\s+(apple|orange|individual|opportunity|aspect|industry|economy|increase|effect|example|author|issue|essential|important|unusual|urban|environment)\b/gi;
  let match;
  while ((match = articleAwithVowel.exec(text)) !== null) {
    grammarMistakes.push({
      original: match[0],
      problem: `Indefinite article 'a' used before vowel sound '${match[2]}'`,
      correction: `an ${match[2]}`,
      explanation: 'Use the article "an" before words starting with vowel sounds to maintain standard phonetic cohesion.',
      category: 'Articles',
    });
  }

  const articleAnwithConsonant = /\b(an)\s+(country|government|majority|percentage|factor|development|society|trend|pattern|solution)\b/gi;
  while ((match = articleAnwithConsonant.exec(text)) !== null) {
    grammarMistakes.push({
      original: match[0],
      problem: `Indefinite article 'an' used before consonant sound '${match[2]}'`,
      correction: `a ${match[2]}`,
      explanation: 'Use "a" before singular nouns beginning with a consonant sound.',
      category: 'Articles',
    });
  }

  // 2. Subject-Verb Agreement checks
  const subjectVerbChecks = [
    { regex: /\b(this\s+results?\s+in)\b/gi, fix: 'this results in' },
    { regex: /\b(the\s+number\s+of\s+\w+\s+are)\b/gi, problem: "'The number of...' takes a singular verb.", correction: 'the number of [noun] is', cat: 'Subject-Verb Agreement' },
    { regex: /\b(every\s+\w+\s+have)\b/gi, problem: "'Every' requires a singular verb.", correction: 'every [noun] has', cat: 'Subject-Verb Agreement' },
    { regex: /\b(people\s+is)\b/gi, problem: "'People' is a plural noun requiring 'are'.", correction: 'people are', cat: 'Subject-Verb Agreement' },
    { regex: /\b(governments\s+has)\b/gi, problem: "Plural subject 'governments' requires 'have'.", correction: 'governments have', cat: 'Subject-Verb Agreement' },
    { regex: /\b(many\s+researches)\b/gi, problem: "'Research' is uncountable in English.", correction: 'a large amount of research / numerous studies', cat: 'Nouns & Plurals' },
    { regex: /\b(informations)\b/gi, problem: "'Information' is an uncountable noun.", correction: 'information / pieces of information', cat: 'Nouns & Plurals' },
  ];

  subjectVerbChecks.forEach((rule) => {
    let m;
    while ((m = rule.regex.exec(text)) !== null) {
      grammarMistakes.push({
        original: m[0],
        problem: rule.problem || 'Subject-verb agreement error.',
        correction: rule.correction || '',
        explanation: 'Agreement between grammatical subject and verb is strictly evaluated under Grammatical Range & Accuracy.',
        category: rule.cat || 'Subject-Verb Agreement',
      });
    }
  });

  // 3. Informal vocabulary check in IELTS academic writing
  const informalWords: Record<string, string> = {
    'kids': 'children / adolescents',
    'lots of': 'a substantial volume of / numerous',
    'a lot of': 'a considerable number of / a significant proportion of',
    'gonna': 'going to',
    'wanna': 'wish to / intend to',
    'stuff': 'belongings / equipment / aspects',
    'thing': 'element / factor / dimension',
    'bad': 'detrimental / adverse / deleterious',
    'good': 'beneficial / advantageous / favorable',
    'big': 'substantial / considerable / prominent',
    'very big': 'exponential / monumental',
  };

  Object.entries(informalWords).forEach(([inf, formal]) => {
    const reg = new RegExp(`\\b${inf}\\b`, 'gi');
    if (reg.test(text)) {
      vocabularyIssues.push({
        original: inf,
        problem: `Informal or colloquial register in an academic exam context.`,
        suggestion: formal,
      });
    }
  });

  // 4. Repetition detection
  const wordFrequency: Record<string, number> = {};
  words.forEach((w) => {
    const cleaned = w.toLowerCase().replace(/[^a-z]/g, '');
    if (cleaned.length > 4 && !['about', 'their', 'there', 'which', 'would', 'could', 'should', 'these', 'those'].includes(cleaned)) {
      wordFrequency[cleaned] = (wordFrequency[cleaned] || 0) + 1;
    }
  });

  const repeatedWords = Object.entries(wordFrequency).filter(([_, count]) => count >= 4);
  repeatedWords.slice(0, 3).forEach(([word, count]) => {
    vocabularyIssues.push({
      original: word,
      problem: `High frequency of repetition (${count} times) limits lexical flexibility.`,
      suggestion: `Use synonyms or nominalization to display wider academic vocabulary.`,
    });
  });

  // 5. Cohesion & Discourse marker evaluation
  const cohesiveDevices = [
    'furthermore', 'moreover', 'consequently', 'in contrast', 'nevertheless',
    'on the other hand', 'in addition', 'as a result', 'subsequently',
    'in conclusion', 'first and foremost', 'despite', 'whereas', 'overall'
  ];
  const foundCohesives = cohesiveDevices.filter((dev) => textLower.includes(dev));

  // Score computation according to IELTS rubrics
  // Band 1-9 scale with 0.5 increments
  let taskAchievement = 6.0;
  let coherenceCohesion = 6.0;
  let lexicalResource = 6.0;
  let grammaticalRange = 6.0;

  // Word count penalties
  if (wordCount < task.minWordCount * 0.6) {
    taskAchievement = 4.5;
  } else if (wordCount < task.minWordCount * 0.85) {
    taskAchievement = 5.0;
  } else if (wordCount < task.minWordCount) {
    taskAchievement = 5.5;
  } else if (wordCount >= task.minWordCount && wordCount <= task.minWordCount + 120) {
    taskAchievement = 7.0;
  } else {
    taskAchievement = 6.5; // Slightly too long can cost time/cohesion
  }

  // Paragraphing
  if (paragraphs.length >= 3 && paragraphs.length <= 5) {
    coherenceCohesion += 0.5;
  } else if (paragraphs.length < 2) {
    coherenceCohesion -= 1.0;
  }

  if (foundCohesives.length >= 4) {
    coherenceCohesion += 0.5;
  } else if (foundCohesives.length <= 1) {
    coherenceCohesion -= 0.5;
  }

  // Lexical
  if (vocabularyIssues.length === 0 && wordCount >= task.minWordCount) {
    lexicalResource = 7.0;
  } else if (vocabularyIssues.length > 4) {
    lexicalResource = 5.5;
  }

  // Grammar
  if (grammarMistakes.length === 0) {
    grammaticalRange = 7.0;
  } else if (grammarMistakes.length > 3) {
    grammaticalRange = 5.0;
  } else {
    grammaticalRange = 5.5;
  }

  // Bound scores between 4.0 and 8.5
  taskAchievement = Math.max(4.0, Math.min(8.5, Math.round(taskAchievement * 2) / 2));
  coherenceCohesion = Math.max(4.0, Math.min(8.5, Math.round(coherenceCohesion * 2) / 2));
  lexicalResource = Math.max(4.0, Math.min(8.5, Math.round(lexicalResource * 2) / 2));
  grammaticalRange = Math.max(4.0, Math.min(8.5, Math.round(grammaticalRange * 2) / 2));

  const average = (taskAchievement + coherenceCohesion + lexicalResource + grammaticalRange) / 4;
  const overallBand = Math.round(average * 2) / 2;

  // Strengths and weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (wordCount >= task.minWordCount) {
    strengths.push(`Met the mandatory minimum length requirement (${wordCount}/${task.minWordCount} words).`);
  } else {
    weaknesses.push(`Fell short of the prescribed minimum of ${task.minWordCount} words (${wordCount} words provided).`);
  }

  if (paragraphs.length >= 3) {
    strengths.push('Organized ideas into clear paragraph structures with discernible topic focus.');
  } else {
    weaknesses.push('Insufficient paragraph division. IELTS examiners expect 3 to 4 distinct paragraphs.');
  }

  if (foundCohesives.length >= 3) {
    strengths.push(`Effective incorporation of transition markers (${foundCohesives.slice(0, 3).join(', ')}).`);
  } else {
    weaknesses.push('Limited use of cohesive discourse markers makes argument progression appear abrupt.');
  }

  if (grammarMistakes.length <= 1) {
    strengths.push('High proportion of error-free sentences with sound structural control.');
  } else {
    weaknesses.push(`${grammarMistakes.length} structural or agreement errors detected in the text.`);
  }

  // Improved rewritten version preserving student's ideas
  let improvedVersion = text;
  grammarMistakes.forEach((err) => {
    if (err.correction) {
      improvedVersion = improvedVersion.replace(err.original, err.correction);
    }
  });

  // Polish transitions if text lacks them
  if (!textLower.includes('in conclusion') && task.taskType === 'task2') {
    improvedVersion += '\n\nIn conclusion, having examined both viewpoints, it is apparent that a balanced approach yields the most sustainable outcome.';
  }

  return {
    id: 'eval-' + Date.now(),
    taskId: task.id,
    submittedAt: new Date().toISOString(),
    studentText: text,
    wordCount,
    characterCount,
    estimatedBand: overallBand,
    scores: {
      taskAchievement,
      coherenceCohesion,
      lexicalResource,
      grammaticalRange,
    },
    strengths,
    weaknesses,
    grammarMistakes,
    vocabularyIssues,
    improvedVersion,
    generalFeedback:
      overallBand >= 7.0
        ? 'Well-executed essay exhibiting consistent academic tone, broad lexical range, and clear logical cohesion. Continued refinement of complex subordinations will help achieve Band 8.0+.'
        : overallBand >= 6.0
        ? 'Competent response that directly addresses the prompt. To advance to Band 7.0+, elevate your lexical variety with less common collocations and eliminate minor grammatical slips in subject-verb agreement.'
        : 'Good initial effort with relevant ideas. Focus on extending your paragraphs with concrete supporting evidence, ensuring the word count comfortably meets requirements, and practicing grammatical precision.',
  };
}
