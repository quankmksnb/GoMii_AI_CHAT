import { Router, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../prompts/system.js";

const router = Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

const MODEL_ID = "gemini-2.5-flash";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  message: string;
  history?: ChatTurn[];
}

router.post("/", async (req: Request, res: Response) => {
  try {
    const { message, history = [] }: ChatRequestBody = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    // ✅ Chuyển role 'assistant' → 'model'
    const contents = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      ...history.map((h) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents,
    });

    const text = response.text || "(Không có nội dung trả về)";
    return res.json({ reply: text });
  } catch (err: any) {
    console.error("🔥 Lỗi khi gọi Gemini:", err);
    return res
      .status(500)
      .json({ error: err.message || "Server error khi gọi Gemini" });
  }
});

export default router;
