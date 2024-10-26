import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Settings } from 'lucide-react'
import { ThreeBackground } from '@/components/ThreeBackground'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AudioPlayer } from '@/components/AudioPlayer'
import { ImageCarousel } from '@/components/ImageCarousel'

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const buttonVariants = {
  hover: { 
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.95 }
}

export default function HomePage() {
  const navigate = useNavigate();
  const [volume, setVolume] = useState(50)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0])
  }

  const images = [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <ThreeBackground />

      <motion.div 
        className="z-10 bg-white/10 dark:bg-gray-900/20 backdrop-blur-lg p-8 rounded-xl shadow-2xl max-w-2xl w-full space-y-8 border border-white/20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
        >
          CharaLinkChat
        </motion.h1>
        
        <motion.p 
          className="text-lg text-center text-white/90"
          variants={itemVariants}
        >
          あなたの好きなキャラクターと音声付きで会話できるアプリへようこそ！
          アバターを作成し、独自の音声をアップロードして、魔法のような対話体験を楽しみましょう。
        </motion.p>

        <motion.div 
          className="flex justify-center space-x-4"
          variants={itemVariants}
        >
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate('/chat')}
            >
              スタート
            </Button>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all" 
              onClick={() => window.open('https://avatarmaker.vket.com/', '_blank')}
            >
              アバター作成
            </Button>
          </motion.div>

          <Dialog>
            <DialogTrigger asChild>
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  説明
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>使い方ガイド</DialogTitle>
                <DialogDescription>
                  CharaLinkChatの使い方を画像で紹介します。
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <ImageCarousel
                  images={images}
                  currentIndex={currentImageIndex}
                  onPrevious={prevImage}
                  onNext={nextImage}
                />
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </motion.div>

      <Sheet>
        <SheetTrigger asChild>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white/95 dark:hover:bg-gray-900/95 transition-colors"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </motion.div>
        </SheetTrigger>
        <SheetContent side="left" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>設定</SheetTitle>
            <SheetDescription>
              音声ファイルをアップロードし、音量を調整します。
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <AudioPlayer volume={volume} onVolumeChange={handleVolumeChange} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
