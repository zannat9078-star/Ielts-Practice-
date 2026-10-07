import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side AI evaluation endpoint with Gemini API
app.post('/api/ai/evaluate-writing', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'GEMINI_API_KEY not configured on server' });
  }

  const { taskPrompt, studentText, minWords, category, taskType, subType } = req.body;
  if (!studentText || studentText.trim().length < 30) {
    return res.status(400).json({ error: 'Text too short for evaluation' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a certified IELTS Principal Examiner. Evaluate the following ${category} ${taskType} (${subType}) student submission according to official Cambridge IELTS assessment criteria.

Task Prompt:
"${taskPrompt}"

Minimum Word Requirement: ${minWords} words
Student Submission:
"""
${studentText}
"""

Return a strictly valid JSON object matching this schema:
{
  "estimatedBand": number (between 4.0 and 9.0 in 0.5 increments),
  "scores": {
    "taskAchievement": number (4.0 to 9.0),
    "coherenceCohesion": number (4.0 to 9.0),
    "lexicalResource": number (4.0 to 9.0),
    "grammaticalRange": number (4.0 to 9.0)
  },
  "strengths": string[] (2-4 concrete strengths),
  "weaknesses": string[] (2-4 areas for improvement),
  "grammarMistakes": [
    {
      "original": string (exact problematic text excerpt),
      "problem": string (linguistic description),
      "correction": string (standard English correction),
      "explanation": string (rule explanation),
      "category": string (e.g. "Articles", "Subject-Verb Agreement", "Tenses", "Punctuation")
    }
  ],
  "vocabularyIssues": [
    {
      "original": string,
      "problem": string,
      "suggestion": string
    }
  ],
  "improvedVersion": string (high-band rewrite of student's essay preserving their exact ideas),
  "generalFeedback": string (motivating constructive summary)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini evaluation error:', error);
    return res.status(500).json({ error: error.message || 'Evaluation failed' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IELTS Practice Hub server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
