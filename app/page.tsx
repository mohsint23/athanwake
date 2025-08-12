"use client"

import { useState, useEffect } from "react"
import { Book, Clock, AlarmClock, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

// Import sections
import QuranSection from "@/components/sections/quran-section"
import AthanSection from "@/components/sections/athan-section"
import AlarmSection from "@/components/sections/alarm-section"
import SettingsSection from "@/components/sections/settings-section"

type Section = "quran" | "athan" | "alarm" | "settings"

export default function AthanWakeApp() {
  const [activeSection, setActiveSection] = useState<Section>("athan")
  const [isOnline, setIsOnline] = useState(true)

  // Handle URL-based section routing for PWA shortcuts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const section = urlParams.get("section") as Section
    if (section && ["quran", "athan", "alarm", "settings"].includes(section)) {
      setActiveSection(section)
    }
  }, [])

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      const indicator = document.getElementById("offline-indicator")
      if (indicator) indicator.classList.add("hidden")
    }

    const handleOffline = () => {
      setIsOnline(false)
      const indicator = document.getElementById("offline-indicator")
      if (indicator) indicator.classList.remove("hidden")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Register for push notifications
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then((registration) => {
        // Request notification permission
        if (Notification.permission === "default") {
          Notification.requestPermission()
        }
      })
    }
  }, [])

  const sections = [
    {
      id: "quran" as Section,
      label: "Quran",
      icon: Book,
      ariaLabel: "القرآن الكريم - Quran section",
    },
    {
      id: "athan" as Section,
      label: "Athan",
      icon: Clock,
      ariaLabel: "الأذان - Prayer times section",
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
    const sectionProps = { id: `${activeSection}-panel`, role: "tabpanel", "aria-labelledby": `${activeSection}-tab` }

    switch (activeSection) {
      case "quran":
        return (
          <div {...sectionProps}>
            <QuranSection />
          </div>
        )
      case "athan":
        return (
          <div {...sectionProps}>
            <AthanSection />
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
      {/* Main Content */}
      <main id="main-content" className="pb-20" role="main">
        <div className="sr-only">
          <h1>Athan Wake - Prayer Companion App</h1>
          <p>Navigate between Quran, Prayer Times, Alarms, and Settings using the bottom navigation.</p>
        </div>
        {renderSection()}
      </main>

      {/* Enhanced bottom navigation with improved accessibility and styling */}
      <nav
        className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-50 safe-area-inset-bottom"
        role="tablist"
        aria-label="Main navigation - التنقل الرئيسي"
      >
        <div className="flex items-center justify-around py-1">
          {sections.map(({ id, label, icon: Icon, ariaLabel }) => (
            <button
              key={id}
              id={`${id}-tab`}
              onClick={() => setActiveSection(id)}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200",
                "min-w-[48px] min-h-[48px] touch-manipulation",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "hover:bg-primary/5 active:bg-primary/10 active:scale-95",
                activeSection === id ? "text-primary bg-primary/10" : "text-muted-foreground",
              )}
              role="tab"
              aria-selected={activeSection === id}
              aria-label={ariaLabel}
              aria-controls={`${id}-panel`}
              tabIndex={activeSection === id ? 0 : -1}
            >
              <Icon
                size={20}
                className={cn("transition-all duration-200", activeSection === id && "scale-110 drop-shadow-sm")}
                aria-hidden="true"
              />
              <span className="text-xs font-medium" dir="auto">
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Enhanced offline indicator with better styling */}
      <div
        id="offline-indicator"
        className="fixed top-4 left-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-sm text-center z-50 hidden shadow-lg"
        role="alert"
        aria-live="polite"
      >
        <span className="font-medium">You are currently offline.</span> Some features may be limited.
      </div>

      {/* Added loading states and connection status */}
      {!isOnline && (
        <div className="fixed bottom-20 left-4 right-4 bg-muted text-muted-foreground px-3 py-2 rounded-md text-xs text-center z-40">
          Using cached data • Last updated: {new Date().toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}
