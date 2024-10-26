import { useRef, useState } from 'react'
import { Volume2 } from 'lucide-react'
import { toast } from "sonner"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface AudioPlayerProps {
  volume: number
  onVolumeChange: (value: number[]) => void
}

export function AudioPlayer({ volume, onVolumeChange }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'audio/mpeg') {
      setAudioFile(file)
      if (audioRef.current) {
        const url = URL.createObjectURL(file)
        audioRef.current.src = url
        audioRef.current.volume = volume / 100
        audioRef.current.play()
          .then(() => {
            toast.success('音声ファイルを再生中')
          })
          .catch((error) => {
            toast.error('音声ファイルの再生に失敗しました')
            console.error('Audio playback error:', error)
          })
      }
    } else {
      toast.error('MP3形式の音声ファイルを選択してください')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="audio-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          音声ファイルをアップロード (MP3)
        </Label>
        <input
          type="file"
          id="audio-upload"
          accept="audio/mpeg"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 dark:text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-50 file:text-purple-700
            dark:file:bg-purple-900 dark:file:text-purple-200
            hover:file:bg-purple-100 dark:hover:file:bg-purple-800
            transition-colors"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Volume2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Slider
          value={[volume]}
          onValueChange={onVolumeChange}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[3ch]">{volume}%</span>
      </div>
      <audio ref={audioRef} controls className="hidden" />
    </div>
  )
}
