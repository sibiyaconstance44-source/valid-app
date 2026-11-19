import { REFLECTION_SYSTEM_PROMPT } from '@/constants/systemPrompt';
import { getLlmSettings } from './storage';

export async function askReflectionAI(
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const settings = await getLlmSettings();

  if (!settings.apiKey) {
    throw new Error('NO_API_KEY');
  }

  const response = await fetch(`${settings.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      messages: [
        { role: 'system', content: REFLECTION_SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`LLM error ${response.status}: ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('Empty response from model');
  return content;
}
