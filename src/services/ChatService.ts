import { GEMINI_API_KEY, GEMINI_BASE_URL, GEMINI_MODEL_ID, DEFAULT_SYSTEM_PROMPT } from '../config/secrets';

export type ChatMessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

export interface ChatResponse {
  message: ChatMessage;
}

const defaultBaseUrl = 'https://api.openai.com/v1';

export async function sendChatMessages(messages: ChatMessage[], abortSignal?: AbortSignal): Promise<ChatResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY. Please add it in src/config/secrets.ts (local only).');
  }

  const baseUrl = GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
  const model = GEMINI_MODEL_ID;

  const contents = toGeminiContents(withSystemInstruction(messages));

  const response = await fetch(`${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.3,
      },
    }),
    signal: abortSignal,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Chat API error: ${response.status} ${text}`);
  }

  const data = await response.json();
  const assistantText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return { message: { role: 'assistant', content: assistantText } };
}

function withSystemInstruction(messages: ChatMessage[]): ChatMessage[] {
  const hasSystem = messages.some(m => m.role === 'system');
  if (hasSystem) return messages;
  return [{ role: 'system', content: DEFAULT_SYSTEM_PROMPT }, ...messages];
}

function toGeminiContents(messages: ChatMessage[]): Array<{ role: string; parts: Array<{ text: string }> }> {
  return messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : m.role, // 'user' | 'system' pass-through, assistant -> model
    parts: [{ text: m.content }],
  }));
}


