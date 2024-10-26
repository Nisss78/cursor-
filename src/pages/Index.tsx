import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Background } from '@/components/Background';
import { VRMViewer } from '@/components/VRMViewer';
import { Message } from '@/types/chat';
import { AIConfig, sendMessage } from '@/lib/ai-config';
import { textToSpeech } from '@/lib/elevenlabs';
import { ChatSettingsMenu } from '@/components/ChatSettingsMenu';
import { DraggableChat } from '@/components/DraggableChat';
import { ChevronLeft } from 'lucide-react';
import { useState, useCallback } from 'react';
import { toast } from "sonner";

function Component() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [vrmUrl, setVrmUrl] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>('/images/default-background.jpg');
  const [aiConfig, setAIConfig] = useState<AIConfig>({
    provider: 'gemini',
    apiKey: '',
    model: 'gemini-pro',
    systemPrompt: 'You are a helpful AI assistant. Please provide clear and concise responses.',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVrmUrl(url);
      toast.success('VRMモデルを更新しました');
    }
  }, []);

  const handleBackgroundChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('画像ファイルをアップロードしてください');
        return;
      }
      const url = URL.createObjectURL(file);
      setBackgroundUrl(url);
      toast.success('背景画像を更新しました');
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (inputMessage.trim() && aiConfig.apiKey) {
      setMessages(prev => [...prev, { text: inputMessage, sender: 'user' }]);
      setInputMessage('');
      setIsLoading(true);
      
      try {
        const response = await sendMessage(inputMessage, aiConfig);
        setMessages(prev => [...prev, { text: response, sender: 'avatar' }]);
        
        if (aiConfig.elevenLabsApiKey && aiConfig.elevenLabsVoiceId) {
          try {
            await textToSpeech(response, {
              apiKey: aiConfig.elevenLabsApiKey,
              voiceId: aiConfig.elevenLabsVoiceId,
              onSpeakingStateChange: setIsSpeaking,
            });
          } catch (error) {
            toast.error('音声の生成に失敗しました');
          }
        }
      } catch (error) {
        toast.error(`${aiConfig.provider}からの応答に失敗しました`);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else if (!aiConfig.apiKey) {
      toast.error('APIキーを設定してください');
    }
  }, [inputMessage, aiConfig]);

  const handleRefreshChat = useCallback(() => {
    setMessages([]);
    toast.success('チャット履歴をクリアしました');
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 left-16 z-50"
        onClick={() => navigate('/')}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <ChatSettingsMenu 
        aiConfig={aiConfig} 
        onConfigChange={(newConfig) => setAIConfig(prev => ({ ...prev, ...newConfig }))}
        onVRMFileChange={handleFileChange}
        onBackgroundChange={handleBackgroundChange}
      />
      
      <div className="absolute inset-0">
        <Background imageUrl={backgroundUrl || '/images/cyberpunk-city.jpg'} />
        {vrmUrl ? (
          <VRMViewer vrmUrl={vrmUrl} isSpeaking={isSpeaking} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 bg-white/10 backdrop-blur-lg p-8 rounded-xl">
              <p className="text-xl text-gray-100">
                VRMモデルをアップロードしてチャットを開始しましょう
              </p>
              <Button
                onClick={() => document.getElementById('vrm-upload')?.click()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                VRMモデルをアップロード
              </Button>
            </div>
          </div>
        )}
      </div>

      <DraggableChat
        messages={messages}
        inputMessage={inputMessage}
        isLoading={isLoading}
        onInputChange={setInputMessage}
        onSendMessage={handleSendMessage}
        onRefreshChat={handleRefreshChat}
      />
    </div>
  );
}

export default Component;