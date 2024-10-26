export interface DifyConfig {
  apiKey: string;
  apiUrl: string;
}

export async function sendMessageToDify(message: string, config: DifyConfig) {
  try {
    const response = await fetch(`${config.apiUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: message,
        response_mode: 'streaming',
        conversation_id: '',
        user: 'user',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message to Dify');
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error('Error sending message to Dify:', error);
    throw error;
  }
}