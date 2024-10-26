import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiConfig {
  apiKey: string;
  systemPrompt: string;
}

export async function sendMessageToGemini(message: string, config: GeminiConfig) {
  try {
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Combine system prompt with user message
    const fullPrompt = `${config.systemPrompt}\n\nUser: ${message}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    throw error;
  }
}