import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AIConfig } from "@/lib/ai-config";

interface AISettingsProps {
  aiConfig: AIConfig;
  onConfigChange: (config: Partial<AIConfig>) => void;
}

export const AISettings = ({ aiConfig, onConfigChange }: AISettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ai-provider">AI Provider</Label>
        <Select value={aiConfig.provider} onValueChange={(value: AIConfig['provider']) => onConfigChange({ provider: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select AI provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemini">Google Gemini</SelectItem>
            <SelectItem value="claude">Anthropic Claude</SelectItem>
            <SelectItem value="openai">OpenAI GPT</SelectItem>
            <SelectItem value="dify">Dify AI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {aiConfig.provider === 'openai' && (
        <div className="space-y-2">
          <Label htmlFor="ai-model">Model</Label>
          <Select 
            value={aiConfig.model} 
            onValueChange={(value) => onConfigChange({ model: value as AIConfig['model'] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {aiConfig.provider === 'dify' && (
        <div className="space-y-2">
          <Label htmlFor="api-url">API URL</Label>
          <Input
            id="api-url"
            value={aiConfig.apiUrl || ''}
            onChange={(e) => onConfigChange({ apiUrl: e.target.value })}
            placeholder="Enter Dify API URL"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="elevenlabs-api-key">ElevenLabs API Key</Label>
        <Input
          id="elevenlabs-api-key"
          type="password"
          value={aiConfig.elevenLabsApiKey || ''}
          onChange={(e) => onConfigChange({ elevenLabsApiKey: e.target.value })}
          placeholder="Enter your ElevenLabs API key"
        />
        <a 
          href="https://elevenlabs.io/app/speech-synthesis/text-to-speech"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline"
        >
          Get ElevenLabs API Key
        </a>
      </div>

      <div className="space-y-2">
        <Label htmlFor="elevenlabs-voice-id">ElevenLabs Voice ID</Label>
        <Input
          id="elevenlabs-voice-id"
          value={aiConfig.elevenLabsVoiceId || ''}
          onChange={(e) => onConfigChange({ elevenLabsVoiceId: e.target.value })}
          placeholder="Enter ElevenLabs Voice ID"
        />
        <p className="text-sm text-gray-500">
          例：男性（JBFqnCBsd6RMkjVDRZzb）、女性（EXAVITQu4vr4xnSDxMaL）
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="api-key">API Key</Label>
        <Input
          id="api-key"
          type="password"
          value={aiConfig.apiKey}
          onChange={(e) => onConfigChange({ apiKey: e.target.value })}
          placeholder={`Enter your ${aiConfig.provider} API key`}
        />
        <a 
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline"
        >
          Get Gemini API Key
        </a>
      </div>

      <div className="space-y-2">
        <Label htmlFor="system-prompt">System Prompt（演じてほしい設定）</Label>
        <Textarea
          id="system-prompt"
          value={aiConfig.systemPrompt}
          onChange={(e) => onConfigChange({ systemPrompt: e.target.value })}
          placeholder="Enter system prompt"
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};
