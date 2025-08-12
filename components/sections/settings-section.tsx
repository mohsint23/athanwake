"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  MapPin,
  Volume2,
  Type,
  BookOpen,
  Moon,
  Sun,
  Calculator,
  User,
  Bell,
  Palette,
  Globe,
  ChevronRight,
  Smartphone,
  Download,
  Shield,
  RotateCcw,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface Settings {
  location: string
  calculationMethod: string
  asrMethod: string
  athanVoice: string
  quranFont: string
  quranFontSize: number
  verseRecitationVerification: boolean
  verseDifficulty: string
  snoozeEnabled: boolean
  snoozeDuration: number
  darkMode: boolean
  notifications: boolean
  vibration: boolean
  language: string
  hijriDateDisplay: boolean
  pwaInstalled: boolean
}

export default function SettingsSection() {
  const [settings, setSettings] = useState<Settings>({
    location: "New York, NY",
    calculationMethod: "mwl",
    asrMethod: "standard",
    athanVoice: "mishary",
    quranFont: "noto-naskh",
    quranFontSize: 18,
    verseRecitationVerification: true,
    verseDifficulty: "easy",
    snoozeEnabled: true,
    snoozeDuration: 5,
    darkMode: false,
    notifications: true,
    vibration: true,
    language: "english",
    hijriDateDisplay: true,
    pwaInstalled: false,
  })

  const [isPlayingPreview, setIsPlayingPreview] = useState(false)

  // Check if PWA is installed
  useEffect(() => {
    const checkPWAInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setSettings((prev) => ({ ...prev, pwaInstalled: isStandalone || isInWebAppiOS }))
    }

    checkPWAInstalled()
  }, [])

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const calculationMethods = [
    { value: "mwl", label: "Muslim World League" },
    { value: "isna", label: "Islamic Society of North America" },
    { value: "egypt", label: "Egyptian General Authority" },
    { value: "makkah", label: "Umm Al-Qura University, Makkah" },
    { value: "karachi", label: "University of Islamic Sciences, Karachi" },
    { value: "tehran", label: "Institute of Geophysics, Tehran" },
    { value: "jafari", label: "Shia Ithna-Ashari (Jafari)" },
  ]

  const asrMethods = [
    { value: "standard", label: "Standard (Shafi, Maliki, Hanbali)" },
    { value: "hanafi", label: "Hanafi" },
  ]

  const athanVoices = [
    { value: "mishary", label: "Mishary Rashid Alafasy" },
    { value: "sudais", label: "Abdul Rahman Al-Sudais" },
    { value: "shuraim", label: "Saud Al-Shuraim" },
    { value: "ghamdi", label: "Saad Al-Ghamdi" },
    { value: "ajmi", label: "Ahmad Al-Ajmi" },
    { value: "husary", label: "Mahmoud Khalil Al-Husary" },
    { value: "minshawi", label: "Mohamed Siddiq Al-Minshawi" },
    { value: "tablawi", label: "Mohamed Al-Tablawi" },
  ]

  const quranFonts = [
    { value: "noto-naskh", label: "Noto Naskh Arabic" },
    { value: "uthmanic", label: "Uthmanic Hafs" },
    { value: "indopak", label: "Indo-Pak" },
    { value: "qalam", label: "Qalam Majeed" },
    { value: "noorehuda", label: "Noorehuda" },
  ]

  const verseDifficulties = [
    { value: "easy", label: "Easy (Short verses)" },
    { value: "medium", label: "Medium (Medium verses)" },
    { value: "hard", label: "Hard (Long verses)" },
  ]

  const languages = [
    { value: "english", label: "English" },
    { value: "arabic", label: "العربية" },
    { value: "urdu", label: "اردو" },
    { value: "turkish", label: "Türkçe" },
    { value: "french", label: "Français" },
    { value: "spanish", label: "Español" },
    { value: "indonesian", label: "Bahasa Indonesia" },
    { value: "malay", label: "Bahasa Melayu" },
  ]

  const playAthanPreview = () => {
    setIsPlayingPreview(!isPlayingPreview)
    // In a real app, this would play/pause the actual Athan preview
    setTimeout(() => setIsPlayingPreview(false), 3000) // Auto-stop after 3 seconds
  }

  const installPWA = () => {
    // In a real app, this would trigger the PWA install prompt
    console.log("Installing PWA...")
  }

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, reverse geocode these coordinates
          updateSetting("location", "Current Location")
        },
        (error) => {
          console.error("Location error:", error)
        },
      )
    }
  }

  const SettingCard = ({
    icon: Icon,
    title,
    description,
    children,
    className,
  }: {
    icon: React.ComponentType<{ size?: number; className?: string }>
    title: string
    description?: string
    children: React.ReactNode
    className?: string
  }) => (
    <Card className={cn("bg-card p-4 rounded-xl shadow-sm", className)}>
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
          <Icon size={20} className="text-primary" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          {description && <p className="text-sm text-muted-foreground mb-3">{description}</p>}
          {children}
        </div>
      </div>
    </Card>
  )

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2 font-[family-name:var(--font-noto-naskh)]" dir="rtl">
          الإعدادات
        </h1>
        <p className="text-muted-foreground">Settings</p>
      </div>

      <div className="space-y-6">
        {/* Prayer Times Settings */}
        <section>
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <MapPin size={20} aria-hidden="true" />
            Prayer Times
          </h2>

          <div className="space-y-4">
            <SettingCard icon={Globe} title="Location" description="Set your location for accurate prayer times">
              <div className="flex gap-2">
                <Input
                  value={settings.location}
                  onChange={(e) => updateSetting("location", e.target.value)}
                  placeholder="Enter your city"
                  className="flex-1"
                  aria-label="Location input"
                />
                <Button
                  variant="outline"
                  onClick={requestLocation}
                  className="min-w-[48px] min-h-[48px] bg-transparent"
                  aria-label="Get current location"
                >
                  <MapPin size={16} />
                </Button>
              </div>
            </SettingCard>

            <SettingCard
              icon={Calculator}
              title="Calculation Method"
              description="Choose the method for calculating prayer times"
            >
              <Select
                value={settings.calculationMethod}
                onValueChange={(value) => updateSetting("calculationMethod", value)}
              >
                <SelectTrigger aria-label="Calculation method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {calculationMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingCard>

            <SettingCard
              icon={Calculator}
              title="Asr Calculation"
              description="Choose the juristic method for Asr prayer time"
            >
              <Select value={settings.asrMethod} onValueChange={(value) => updateSetting("asrMethod", value)}>
                <SelectTrigger aria-label="Asr calculation method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {asrMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingCard>

            <SettingCard
              icon={BookOpen}
              title="Hijri Date Display"
              description="Show Islamic calendar date alongside Gregorian date"
            >
              <div className="flex items-center justify-between">
                <Switch
                  checked={settings.hijriDateDisplay}
                  onCheckedChange={(checked) => updateSetting("hijriDateDisplay", checked)}
                  aria-label="Toggle Hijri date display"
                />
              </div>
            </SettingCard>
          </div>
        </section>

        <Separator />

        {/* Audio Settings */}
        <section>
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <Volume2 size={20} aria-hidden="true" />
            Audio
          </h2>

          <div className="space-y-4">
            <SettingCard
              icon={User}
              title="Athan Voice"
              description="Select your preferred muezzin for the call to prayer"
            >
              <div className="space-y-3">
                <Select value={settings.athanVoice} onValueChange={(value) => updateSetting("athanVoice", value)}>
                  <SelectTrigger aria-label="Athan voice selection">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {athanVoices.map((voice) => (
                      <SelectItem key={voice.value} value={voice.value}>
                        {voice.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={playAthanPreview}
                  className="bg-transparent"
                  disabled={isPlayingPreview}
                  aria-label={isPlayingPreview ? "Playing preview" : "Play Athan preview"}
                >
                  <Play size={14} className="mr-2" />
                  {isPlayingPreview ? "Playing..." : "Preview"}
                </Button>
              </div>
            </SettingCard>
          </div>
        </section>

        <Separator />

        {/* Quran Settings */}
        <section>
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <BookOpen size={20} aria-hidden="true" />
            Quran
          </h2>

          <div className="space-y-4">
            <SettingCard icon={Type} title="Font Style" description="Choose your preferred Arabic font for Quran text">
              <Select value={settings.quranFont} onValueChange={(value) => updateSetting("quranFont", value)}>
                <SelectTrigger aria-label="Quran font selection">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {quranFonts.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingCard>

            <SettingCard
              icon={Type}
              title="Font Size"
              description="Adjust the size of Quran text for comfortable reading"
            >
              <div className="space-y-3">
                <Slider
                  value={[settings.quranFontSize]}
                  onValueChange={(value) => updateSetting("quranFontSize", value[0])}
                  min={14}
                  max={32}
                  step={2}
                  className="w-full"
                  aria-label="Quran font size"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Small (14px)</span>
                  <span className="font-medium text-primary">Current: {settings.quranFontSize}px</span>
                  <span>Large (32px)</span>
                </div>
                <div
                  className="p-3 bg-primary/5 rounded-lg text-center font-[family-name:var(--font-noto-naskh)]"
                  style={{ fontSize: `${settings.quranFontSize}px` }}
                  dir="rtl"
                >
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
              </div>
            </SettingCard>
          </div>
        </section>

        <Separator />

        {/* Alarm Settings */}
        <section>
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <Bell size={20} aria-hidden="true" />
            Alarms
          </h2>

          <div className="space-y-4">
            <SettingCard
              icon={BookOpen}
              title="Verse Recitation Verification"
              description="Require reciting Quranic verses to dismiss alarms"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Switch
                    checked={settings.verseRecitationVerification}
                    onCheckedChange={(checked) => updateSetting("verseRecitationVerification", checked)}
                    aria-label="Toggle verse recitation verification"
                  />
                </div>
                {settings.verseRecitationVerification && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Verse Difficulty</label>
                    <Select
                      value={settings.verseDifficulty}
                      onValueChange={(value) => updateSetting("verseDifficulty", value)}
                    >
                      <SelectTrigger aria-label="Verse difficulty selection">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {verseDifficulties.map((difficulty) => (
                          <SelectItem key={difficulty.value} value={difficulty.value}>
                            {difficulty.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </SettingCard>

            <SettingCard
              icon={RotateCcw}
              title="Snooze Options"
              description="Configure snooze functionality for alarms"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enable Snooze</span>
                  <Switch
                    checked={settings.snoozeEnabled}
                    onCheckedChange={(checked) => updateSetting("snoozeEnabled", checked)}
                    aria-label="Toggle snooze functionality"
                  />
                </div>
                {settings.snoozeEnabled && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Snooze Duration: {settings.snoozeDuration} minutes
                    </label>
                    <Slider
                      value={[settings.snoozeDuration]}
                      onValueChange={(value) => updateSetting("snoozeDuration", value[0])}
                      min={1}
                      max={15}
                      step={1}
                      className="w-full"
                      aria-label="Snooze duration in minutes"
                    />
                  </div>
                )}
              </div>
            </SettingCard>

            <SettingCard
              icon={Bell}
              title="Notifications"
              description="Enable push notifications for prayer times and alarms"
            >
              <div className="flex items-center justify-between">
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSetting("notifications", checked)}
                  aria-label="Toggle notifications"
                />
              </div>
            </SettingCard>

            <SettingCard
              icon={Smartphone}
              title="Vibration"
              description="Enable vibration for alarms and notifications"
            >
              <div className="flex items-center justify-between">
                <Switch
                  checked={settings.vibration}
                  onCheckedChange={(checked) => updateSetting("vibration", checked)}
                  aria-label="Toggle vibration"
                />
              </div>
            </SettingCard>
          </div>
        </section>

        <Separator />

        {/* Appearance Settings */}
        <section>
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <Palette size={20} aria-hidden="true" />
            Appearance
          </h2>

          <div className="space-y-4">
            <SettingCard
              icon={settings.darkMode ? Moon : Sun}
              title="Dark Mode"
              description="Switch between light and dark themes"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun size={16} className="text-yellow-500" aria-hidden="true" />
                  <span className="text-sm">Light</span>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => updateSetting("darkMode", checked)}
                  aria-label="Toggle dark mode"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm">Dark</span>
                  <Moon size={16} className="text-blue-500" aria-hidden="true" />
                </div>
              </div>
            </SettingCard>

            <SettingCard
              icon={Globe}
              title="Language"
              description="Choose your preferred language for the app interface"
            >
              <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                <SelectTrigger aria-label="Language selection">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SettingCard>
          </div>
        </section>

        <Separator />

        {/* PWA Settings */}
        <section>
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <Download size={20} aria-hidden="true" />
            App Installation
          </h2>

          <div className="space-y-4">
            {!settings.pwaInstalled && (
              <SettingCard
                icon={Download}
                title="Install App"
                description="Install Athan Wake as a native app for better performance and offline access"
              >
                <Button
                  onClick={installPWA}
                  className="w-full bg-primary hover:bg-primary/90"
                  aria-label="Install Athan Wake as PWA"
                >
                  <Download size={16} className="mr-2" />
                  Install Athan Wake
                </Button>
              </SettingCard>
            )}

            {settings.pwaInstalled && (
              <SettingCard
                icon={Shield}
                title="App Installed"
                description="Athan Wake is installed and ready for offline use"
                className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
              >
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <Shield size={16} />
                  <span className="text-sm font-medium">Successfully installed</span>
                </div>
              </SettingCard>
            )}
          </div>
        </section>

        <Separator />

        {/* Additional Options */}
        <section>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between bg-transparent min-h-[48px]"
              aria-label="About Athan Wake"
            >
              <span>About Athan Wake</span>
              <ChevronRight size={16} />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between bg-transparent min-h-[48px]"
              aria-label="Privacy Policy"
            >
              <span>Privacy Policy</span>
              <ChevronRight size={16} />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between bg-transparent min-h-[48px]"
              aria-label="Support and Feedback"
            >
              <span>Support & Feedback</span>
              <ChevronRight size={16} />
            </Button>
          </div>
        </section>

        {/* Save Button */}
        <Button className="w-full mt-8 bg-primary hover:bg-primary/90 min-h-[48px]" aria-label="Save all settings">
          Save Settings
        </Button>

        {/* App Version */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">Athan Wake v1.0.0</p>
        </div>
      </div>
    </div>
  )
}
