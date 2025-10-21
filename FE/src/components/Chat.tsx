import React, { useState } from 'react';
import { sendMessage, type ChatTurn } from '../api';

export default function Chat() {
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput('');
    const newHistory = [...history, { role: 'user', content: msg }];
    setHistory(newHistory);
    setLoading(true);
    try {
      const { reply } = await sendMessage(msg, newHistory);
      setHistory(h => [...h, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      setHistory(h => [...h, { role: 'assistant', content: `⚠️ Lỗi: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-w-3xl mx-auto p-4 flex flex-col">
      <h1 style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>
        GoMii – AI Tư Vấn Thiết Kế Gốm
      </h1>

      <div style={{
        flex: 1, overflowY: 'auto', border: '1px solid #e5e7eb',
        borderRadius: 8, padding: 12, marginBottom: 12
      }}>
        {history.length === 0 && (
          <div style={{ color: '#6b7280' }}>
            Hãy mô tả phong cách của bạn (tối giản/retro/scandi), không gian (phòng khách/bàn ăn), 
            chức năng (bình hoa/cốc/tượng decor), cung hoàng đạo, ngân sách… 
            Mình sẽ gợi ý mẫu gốm phù hợp.
          </div>
        )}
        {history.map((t, i) => (
          <div key={i} style={{ margin: '8px 0' }}>
            <div style={{ fontWeight: 600, color: t.role === 'user' ? '#111827' : '#2563eb' }}>
              {t.role === 'user' ? 'Bạn' : 'GoMii AI'}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{t.content}</div>
          </div>
        ))}
        {loading && <div style={{ opacity: 0.7 }}>GoMii AI đang suy nghĩ…</div>}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ví dụ: Mình muốn bình hoa phong cách tối giản, cao ~25cm, tông be-trắng cho phòng khách ánh vàng…"
          onKeyDown={e => e.key === 'Enter' && onSend()}
          style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
        <button
          onClick={onSend}
          disabled={loading}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            background: '#111827',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
