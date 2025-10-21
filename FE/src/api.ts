const BASE_URL = 'http://localhost:5000';

export type ChatTurn = { role: 'user' | 'assistant'; content: string };

export async function sendMessage(message: string, history: ChatTurn[]) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<{ reply: string }>;
}
