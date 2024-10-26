import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { AISettings } from "./AISettings"
import { AIConfig } from "@/lib/ai-config"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatSettingsMenuProps {
  aiConfig: AIConfig
  onConfigChange: (config: Partial<AIConfig>) => void
  onVRMFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBackgroundChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  children?: React.ReactNode  // 追加
}

export function ChatSettingsMenu({ 
  aiConfig, 
  onConfigChange,
  onVRMFileChange,
  onBackgroundChange,
  children
}: ChatSettingsMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="absolute top-4 left-4 z-50">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[540px] p-0">
        {children}
        <SheetHeader className="p-6 pb-2">
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-5rem)] px-6">
          <div className="space-y-6 pb-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">VRM Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vrm-file">VRM Model</Label>
                  <Input 
                    id="vrm-file" 
                    type="file" 
                    accept=".vrm" 
                    onChange={onVRMFileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="background-file">Background Image</Label>
                  <Input 
                    id="background-file" 
                    type="file" 
                    accept="image/*" 
                    onChange={onBackgroundChange}
                  />
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-4">Chat Settings</h3>
              <AISettings aiConfig={aiConfig} onConfigChange={onConfigChange} />
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
