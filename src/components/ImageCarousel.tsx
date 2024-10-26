import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'

interface ImageCarouselProps {
  images: string[]
  currentIndex: number
  onPrevious: () => void
  onNext: () => void
}

export function ImageCarousel({ images, currentIndex, onPrevious, onNext }: ImageCarouselProps) {
  // 画像URLを追加
  const guideImages = [
    "https://cdn.discordapp.com/attachments/1105314389789245552/1299427857801416785/Avatar_Maker_1.png?ex=671d29ff&is=671bd87f&hm=eaaf128d94e855e3663f944fea4d4a19f928933b3ac72ed0baadd371b81f0bf5&",
    "https://media.discordapp.net/attachments/1105314389789245552/1299423720993198170/2.png?ex=671d2625&is=671bd4a5&hm=63461214b4281628b26781ae0d79c7bdc8b736e10bb5771cebba01fe6d456b1b&=&format=webp&quality=lossless&width=1410&height=794",
    "https://media.discordapp.net/attachments/1105314389789245552/1299423721487990894/3.png?ex=671d2625&is=671bd4a5&hm=9411264521ccb8850592d102cc9f5eb0961ae9324ad373e07793db4226038f96&=&format=webp&quality=lossless&width=1410&height=794",
    ...images
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={guideImages[currentIndex]}
          alt={`使い方ガイド ${currentIndex + 1}`}
          className="w-full h-[400px] object-cover rounded-lg"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>
      
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 transition-colors rounded-full"
            onClick={onPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">前のスライド</span>
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/80 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 transition-colors rounded-full"
            onClick={onNext}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">次のスライド</span>
          </Button>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {currentIndex + 1} / {images.length}
      </motion.div>
    </div>
  )
}
