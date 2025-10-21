import { Router } from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from '../prompts/system.js';
const router = Router();
const modelId = 'gemini-2.0-flash';
router.post('/', async (req, res) => {
    try {
        const { message, history = [] } = req.body;
        if (!message)
            return res.status(400).json({ error: 'message is required' });
        const client = new GoogleGenerativeAI({
            apiKey: process.env.GEMINI_API_KEY
        });
        const model = client.getGenerativeModel({ model: modelId });
        // build contents: system → history → user
        const contents = [];
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
    }
    catch (err) {
        console.error('Lỗi này' ,err);
        return res.status(500).json({ error: err?.message || 'Server error' });
    }
});
export default router;
//# sourceMappingURL=chat.js.map