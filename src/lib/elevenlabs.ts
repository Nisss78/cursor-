export interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  onSpeakingStateChange?: (isSpeaking: boolean) => void;
}

export async function textToSpeech(text: string, config: ElevenLabsConfig) {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': config.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to convert text to speech');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    // Set up speaking state handlers
    audio.addEventListener('play', () => {
      config.onSpeakingStateChange?.(true);
    });

    audio.addEventListener('ended', () => {
      config.onSpeakingStateChange?.(false);
    });

    audio.addEventListener('pause', () => {
      config.onSpeakingStateChange?.(false);
    });

    await audio.play();

    return audioUrl;
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    throw error;
  }
}