"use client"

import { useState, useEffect } from "react"
import { Book, Clock, AlarmClock, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

// Import sections
import QuranSection from "@/components/sections/quran-section"
import AthanSection from "@/components/sections/athan-section"
import AlarmSection from "@/components/sections/alarm-section"
import SettingsSection from "@/components/sections/settings-section"

type Section = "athan" | "quran" | "alarm" | "settings"

export default function AthanWakeApp() {
  const [activeSection, setActiveSection] = useState<Section>("athan")

  // Handle URL-based section routing for PWA shortcuts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const section = urlParams.get("section") as Section
    if (section && ["athan", "quran", "alarm", "settings"].includes(section)) {
      setActiveSection(section)
    }
  }, [])

  // Register for push notifications
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then(() => {
        if (Notification.permission === "default") {
          Notification.requestPermission()
        }
      })
    }
  }, [])

  const sections = [
    {
      id: "athan" as Section,
      label: "Athan",
      icon: Clock,
      ariaLabel: "الأذان - Prayer times section",
    },
    {
      id: "quran" as Section,
      label: "Quran",
      icon: Book,
      ariaLabel: "القرآن الكريم - Quran section",
    },
    {
      id: "alarm" as Section,
      label: "Alarm",
      icon: AlarmClock,
      ariaLabel: "المنبه - Alarms section",
    },
    {
      id: "settings" as Section,
      label: "Settings",
      icon: Settings,
      ariaLabel: "الإعدادات - Settings section",
    },
  ]

  const renderSection = () => {
    const sectionProps = {
      id: `${activeSection}-panel`,
      role: "tabpanel",
      "aria-labelledby": `${activeSection}-tab`,
    }

    switch (activeSection) {
      case "athan":
        return (
          <div {...sectionProps}>
            <AthanSection />
          </div>
        )
      case "quran":
        return (
          <div {...sectionProps}>
            <QuranSection />
          </div>
        )
      case "alarm":
        return (
          <div {...sectionProps}>
            <AlarmSection />
          </div>
        )
      case "settings":
        return (
          <div {...sectionProps}>
            <SettingsSection />
          </div>
        )
      default:
        return (
          <div {...sectionProps}>
            <AthanSection />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main id="main-content" className="pb-20" role="main">
        <div className="sr-only">
          <h1>Athan Wake - Prayer Companion App</h1>
          <p>Navigate between Prayer Times, Quran, Alarms, and Settings using the bottom navigation.</p>
        </div>
        {renderSection()}
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50 safe-area-inset-bottom"
        role="tablist"
        aria-label="Main navigation - التنقل الرئيسي"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {sections.map(({ id, label, icon: Icon, ariaLabel }) => (
            <button
              key={id}
              id={`${id}-tab`}
              onClick={() => setActiveSection(id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg transition-all duration-200",
                "min-w-[56px] min-h-[56px] px-4 py-2 touch-manipulation",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "hover:bg-primary/5 active:bg-primary/10 active:scale-95",
                "border-2 border-transparent",
                activeSection === id
                  ? "text-primary bg-primary/10 border-primary/20"
                  : "text-muted-foreground hover:text-foreground",
              )}
              role="tab"
              aria-selected={activeSection === id}
              aria-current={activeSection === id ? "page" : undefined}
              aria-label={ariaLabel}
              aria-controls={`${id}-panel`}
              tabIndex={activeSection === id ? 0 : -1}
            >
              <Icon
                size={20}
                className={cn(
                  "transition-all duration-200 flex-shrink-0",
                  activeSection === id && "scale-110 drop-shadow-sm",
                )}
                aria-hidden="true"
              />
              <span className="text-xs font-medium leading-tight" dir="auto">
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <div
        id="offline-indicator"
        className="fixed top-4 left-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-sm text-center z-50 hidden shadow-lg"
        role="alert"
        aria-live="polite"
      >
        You are offline. Some features may be limited.
      </div>
    </div>
  )
}
