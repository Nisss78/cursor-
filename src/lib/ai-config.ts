import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai/index.mjs';
import { sendMessageToDify } from './dify';

export type AIModel = 'gemini-pro' | 'claude-3-sonnet' | 'gpt-4' | 'gpt-4o-mini';

export interface AIConfig {
  provider: 'gemini' | 'claude' | 'openai' | 'dify';
  apiKey: string;
  model: AIModel;
  systemPrompt: string;
  apiUrl?: string;
  elevenLabsApiKey?: string;
  elevenLabsVoiceId?: string;
}

export async function sendMessage(message: string, config: AIConfig) {
  try {
    switch (config.provider) {
      case 'gemini': {
        const genAI = new GoogleGenerativeAI(config.apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const fullPrompt = `${config.systemPrompt}\n\nUser: ${message}`;
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
      }
      
      case 'claude': {
        const response = await fetch('/api/chat/claude', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            systemPrompt: config.systemPrompt,
            apiKey: config.apiKey,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from Claude API');
        }

        const data = await response.json();
        return data.response;
      }

      case 'openai': {
        const openai = new OpenAI({
          apiKey: config.apiKey,
        });
        const response = await openai.chat.completions.create({
          model: config.model,
          messages: [
            { role: "system", content: config.systemPrompt },
            { role: "user", content: message }
          ],
        });
        return response.choices[0].message.content || '';
      }

      case 'dify': {
        if (!config.apiUrl) {
          throw new Error('Dify API URL is required');
        }
        return await sendMessageToDify(message, {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
        });
      }

      default:
        throw new Error('Invalid AI provider');
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}