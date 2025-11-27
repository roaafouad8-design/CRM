import OpenAI from 'openai';

export class AIService {
  private client: OpenAI | null;

  constructor(apiKey = process.env.OPENAI_API_KEY) {
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  /**
   * Generate a reply for a bot/agent conversation.
   * Falls back to a friendly static response when OpenAI is not configured.
   */
  async generateReply(prompt: string, history: { role: 'user' | 'assistant'; content: string }[] = []) {
    if (!this.client) {
      return 'AI agent not configured yet. Set OPENAI_API_KEY to enable responses.';
    }

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful WhatsApp CRM assistant.' },
        ...history,
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content ?? '';
  }
}
