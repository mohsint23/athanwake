"use client"

import { useState } from "react"
import { Book, Clock, AlarmClock, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

// Import sections (we'll create these in subsequent tasks)
import QuranSection from "@/components/sections/quran-section"
import AthanSection from "@/components/sections/athan-section"
import AlarmSection from "@/components/sections/alarm-section"
import SettingsSection from "@/components/sections/settings-section"

type Section = "quran" | "athan" | "alarm" | "settings"

export default function AthanWakeApp() {
  const [activeSection, setActiveSection] = useState<Section>("athan")

  const sections = [
    { id: "quran" as Section, label: "Quran", icon: Book },
    { id: "athan" as Section, label: "Athan", icon: Clock },
    { id: "alarm" as Section, label: "Alarm", icon: AlarmClock },
    { id: "settings" as Section, label: "Settings", icon: Settings },
  ]

  const renderSection = () => {
    switch (activeSection) {
      case "quran":
        return <QuranSection />
      case "athan":
        return <AthanSection />
      case "alarm":
        return <AlarmSection />
      case "settings":
        return <SettingsSection />
      default:
        return <AthanSection />
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] dark:bg-[#1C1C1C] text-black dark:text-white">
      {/* Main Content */}
      <main className="pb-20">{renderSection()}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#2A2A2A]/95 backdrop-blur-sm border-t border-[#0F4C3A]/10 dark:border-white/10">
        <div className="flex items-center justify-around py-2">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200 min-w-[60px]",
                activeSection === id
                  ? "text-[#0F4C3A] dark:text-[#F2C94C]"
                  : "text-gray-500 dark:text-gray-400 hover:text-[#0F4C3A] dark:hover:text-[#F2C94C]",
              )}
            >
              <Icon size={24} className={cn("transition-all duration-200", activeSection === id && "scale-110")} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
