import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/genai';
import type { Request, Response } from 'express';
import { SYSTEM_PROMPT } from '../prompts/system.js';

const router = Router();
const modelId = 'gemini-2.0-flash-001'; // stable; 'gemini-2.0-flash' là alias latest
// Model IDs & versions: xem trang "Gemini Models" để biết latest/stable. 
// https://ai.google.dev/gemini-api/docs/models
// (gemini-2.0-flash, gemini-2.0-flash-001, gemini-2.0-flash-exp)
 
router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body as {
      message: string;
      history?: Array<{ role: 'user' | 'assistant'; content: string }>;
    };

    if (!message) return res.status(400).json({ error: 'message is required' });

    const client = new GoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY!
    });

    const model = client.getGenerativeModel({ model: modelId });

    // build contents: system → history → user
    const contents: any[] = [];
    contents.push({ role: 'user', parts: [{ text: SYSTEM_PROMPT }] });
    for (const turn of history) {
      contents.push({ role: turn.role, parts: [{ text: turn.content }] });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    // Simple (non-streaming) call
    const result = await model.generateContent({
      contents
    });

    const text = result.response?.text() ?? '(không có nội dung)';
    return res.json({ reply: text });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
});

export default router;
