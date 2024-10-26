import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Move, RefreshCw, Send, Smile } from "lucide-react";
import { Message } from '@/types/chat';
import { motion, AnimatePresence } from 'framer-motion';

interface DraggableChatProps {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onRefreshChat: () => void;
}

export function DraggableChat({
  messages,
  inputMessage,
  isLoading,
  onInputChange,
  onSendMessage,
  onRefreshChat
}: DraggableChatProps) {
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 20 }); // 右上に配置
  const [size, setSize] = useState({ width: 400, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(e.clientX - dragStart.x, window.innerWidth - size.width));
      const newY = Math.max(0, Math.min(e.clientY - dragStart.y, window.innerHeight - size.height));
      setPosition({ x: newX, y: newY });
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(300, Math.min(resizeStart.width + deltaX, window.innerWidth - position.x));
      const newHeight = Math.max(400, Math.min(resizeStart.height + deltaY, window.innerHeight - position.y));
      
      setSize({ width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  return (
    <motion.div
      className="fixed z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <motion.div 
        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-t-lg cursor-move flex items-center justify-between"
        onMouseDown={handleMouseDown}
        whileHover={{ backgroundColor: 'rgb(243 244 246)' }}
      >
        <Move className="h-4 w-4 text-gray-500" />
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefreshChat}
          title="Clear chat history"
          className="hover:rotate-180 transition-transform duration-300"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </motion.div>
      
      <div className="p-4 flex flex-col h-[calc(100%-4rem)]">
        <ScrollArea className="flex-1 mb-4 pr-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <motion.span
                  className={`inline-block p-2 rounded-lg max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {message.text}
                </motion.span>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>

        <div className="flex space-x-2 items-end">
          <Button
            variant="ghost"
            size="icon"
            className="mb-1"
          >
            <Smile className="h-5 w-5 text-gray-500" />
          </Button>
          <Input
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && onSendMessage()}
            placeholder="メッセージを入力..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={onSendMessage} 
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="h-4 w-4" />
              </motion.div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 right-0 cursor-nw-resize p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-bl-lg transition-colors"
        onMouseDown={handleResizeMouseDown}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Move className="h-4 w-4 text-gray-500 rotate-45" />
      </motion.div>
    </motion.div>
  );
}
