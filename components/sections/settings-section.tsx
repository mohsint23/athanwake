"use client"

import type React from "react"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface Settings {
  location: string
  calculationMethod: string
  athanVoice: string
  quranFont: string
  quranFontSize: number
  verseRecitationVerification: boolean
  darkMode: boolean
  notifications: boolean
  vibration: boolean
  language: string
}

export default function SettingsSection() {
  const [settings, setSettings] = useState<Settings>({
    location: "New York, NY",
    calculationMethod: "isna",
    athanVoice: "mishary",
    quranFont: "uthmanic",
    quranFontSize: 18,
    verseRecitationVerification: true,
    darkMode: false,
    notifications: true,
    vibration: true,
    language: "english",
  })

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const calculationMethods = [
    { value: "isna", label: "ISNA (Islamic Society of North America)" },
    { value: "mwl", label: "MWL (Muslim World League)" },
    { value: "egypt", label: "Egyptian General Authority of Survey" },
    { value: "makkah", label: "Umm Al-Qura University, Makkah" },
    { value: "karachi", label: "University of Islamic Sciences, Karachi" },
    { value: "tehran", label: "Institute of Geophysics, University of Tehran" },
  ]

  const athanVoices = [
    { value: "mishary", label: "Mishary Rashid Alafasy" },
    { value: "sudais", label: "Abdul Rahman Al-Sudais" },
    { value: "shuraim", label: "Saud Al-Shuraim" },
    { value: "ghamdi", label: "Saad Al-Ghamdi" },
    { value: "ajmi", label: "Ahmad Al-Ajmi" },
    { value: "husary", label: "Mahmoud Khalil Al-Husary" },
  ]

  const quranFonts = [
    { value: "uthmanic", label: "Uthmanic Hafs" },
    { value: "indopak", label: "Indo-Pak" },
    { value: "qalam", label: "Qalam Majeed" },
    { value: "noorehuda", label: "Noorehuda" },
  ]

  const languages = [
    { value: "english", label: "English" },
    { value: "arabic", label: "العربية" },
    { value: "urdu", label: "اردو" },
    { value: "turkish", label: "Türkçe" },
    { value: "french", label: "Français" },
    { value: "spanish", label: "Español" },
  ]

  const SettingCard = ({
    icon: Icon,
    title,
    description,
    children,
  }: {
    icon: React.ComponentType<{ size?: number; className?: string }>
    title: string
    description?: string
    children: React.ReactNode
  }) => (
    <Card className="bg-white dark:bg-[#2A2A2A] p-4 rounded-xl shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-[#0F4C3A]/10 dark:bg-[#F2C94C]/10 rounded-lg">
          <Icon size={20} className="text-[#0F4C3A] dark:text-[#F2C94C]" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[#0F4C3A] dark:text-white mb-1">{title}</h3>
          {description && <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{description}</p>}
          {children}
        </div>
      </div>
    </Card>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C3A] dark:text-[#F2C94C] mb-2 font-[family-name:var(--font-amiri)]">
          الإعدادات
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Settings</p>
      </div>

      <div className="space-y-6">
        {/* Prayer Times Settings */}
        <div>
          <h2 className="text-lg font-semibold text-[#0F4C3A] dark:text-[#F2C94C] mb-4 flex items-center gap-2">
            <MapPin size={20} />
            Prayer Times
          </h2>

          <div className="space-y-4">
            <SettingCard icon={Globe} title="Location" description="Set your location for accurate prayer times">
              <div className="flex gap-2">
                <Input
                  value={settings.location}
                  onChange={(e) => updateSetting("location", e.target.value)}
                  placeholder="Enter your city"
                  className="flex-1 bg-white dark:bg-[#1C1C1C]"
                />
                <Button
                  variant="outline"
                  className="border-[#0F4C3A] text-[#0F4C3A] dark:border-[#F2C94C] dark:text-[#F2C94C] bg-transparent"
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
                <SelectTrigger className="bg-white dark:bg-[#1C1C1C]">
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
          </div>
        </div>

        <Separator className="bg-[#0F4C3A]/20 dark:bg-[#F2C94C]/20" />

        {/* Audio Settings */}
        <div>
          <h2 className="text-lg font-semibold text-[#0F4C3A] dark:text-[#F2C94C] mb-4 flex items-center gap-2">
            <Volume2 size={20} />
            Audio
          </h2>

          <div className="space-y-4">
            <SettingCard
              icon={User}
              title="Athan Voice"
              description="Select your preferred muezzin for the call to prayer"
            >
              <Select value={settings.athanVoice} onValueChange={(value) => updateSetting("athanVoice", value)}>
                <SelectTrigger className="bg-white dark:bg-[#1C1C1C]">
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
                className="mt-2 border-[#0F4C3A] text-[#0F4C3A] dark:border-[#F2C94C] dark:text-[#F2C94C] bg-transparent"
              >
                Preview
              </Button>
            </SettingCard>
          </div>
        </div>

        <Separator className="bg-[#0F4C3A]/20 dark:bg-[#F2C94C]/20" />

        {/* Quran Settings */}
        <div>
          <h2 className="text-lg font-semibold text-[#0F4C3A] dark:text-[#F2C94C] mb-4 flex items-center gap-2">
            <BookOpen size={20} />
            Quran
          </h2>

          <div className="space-y-4">
            <SettingCard icon={Type} title="Font Style" description="Choose your preferred Arabic font for Quran text">
              <Select value={settings.quranFont} onValueChange={(value) => updateSetting("quranFont", value)}>
                <SelectTrigger className="bg-white dark:bg-[#1C1C1C]">
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
                  max={28}
                  step={2}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Small (14px)</span>
                  <span className="font-medium text-[#0F4C3A] dark:text-[#F2C94C]">
                    Current: {settings.quranFontSize}px
                  </span>
                  <span>Large (28px)</span>
                </div>
                <div
                  className="p-3 bg-[#0F4C3A]/5 dark:bg-[#F2C94C]/5 rounded-lg text-center font-[family-name:var(--font-amiri)]"
                  style={{ fontSize: `${settings.quranFontSize}px` }}
                >
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
              </div>
            </SettingCard>
          </div>
        </div>

        <Separator className="bg-[#0F4C3A]/20 dark:bg-[#F2C94C]/20" />

        {/* Alarm Settings */}
        <div>
          <h2 className="text-lg font-semibold text-[#0F4C3A] dark:text-[#F2C94C] mb-4 flex items-center gap-2">
            <Bell size={20} />
            Alarms
          </h2>

          <div className="space-y-4">
            <SettingCard
              icon={BookOpen}
              title="Verse Recitation Verification"
              description="Require reciting Quranic verses to dismiss alarms"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    When enabled, you'll need to recite a verse correctly to stop the alarm
                  </p>
                </div>
                <Switch
                  checked={settings.verseRecitationVerification}
                  onCheckedChange={(checked) => updateSetting("verseRecitationVerification", checked)}
                />
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
                />
              </div>
            </SettingCard>

            <SettingCard icon={Bell} title="Vibration" description="Enable vibration for alarms and notifications">
              <div className="flex items-center justify-between">
                <Switch
                  checked={settings.vibration}
                  onCheckedChange={(checked) => updateSetting("vibration", checked)}
                />
              </div>
            </SettingCard>
          </div>
        </div>

        <Separator className="bg-[#0F4C3A]/20 dark:bg-[#F2C94C]/20" />

        {/* Appearance Settings */}
        <div>
          <h2 className="text-lg font-semibold text-[#0F4C3A] dark:text-[#F2C94C] mb-4 flex items-center gap-2">
            <Palette size={20} />
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
                  <Sun size={16} className="text-yellow-500" />
                  <span className="text-sm">Light</span>
                </div>
                <Switch checked={settings.darkMode} onCheckedChange={(checked) => updateSetting("darkMode", checked)} />
                <div className="flex items-center gap-2">
                  <span className="text-sm">Dark</span>
                  <Moon size={16} className="text-blue-500" />
                </div>
              </div>
            </SettingCard>

            <SettingCard
              icon={Globe}
              title="Language"
              description="Choose your preferred language for the app interface"
            >
              <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                <SelectTrigger className="bg-white dark:bg-[#1C1C1C]">
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
        </div>

        <Separator className="bg-[#0F4C3A]/20 dark:bg-[#F2C94C]/20" />

        {/* Additional Options */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-between border-[#0F4C3A] text-[#0F4C3A] dark:border-[#F2C94C] dark:text-[#F2C94C] bg-transparent"
          >
            <span>About Athan Wake</span>
            <ChevronRight size={16} />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-between border-[#0F4C3A] text-[#0F4C3A] dark:border-[#F2C94C] dark:text-[#F2C94C] bg-transparent"
          >
            <span>Privacy Policy</span>
            <ChevronRight size={16} />
          </Button>

          <Button
            variant="outline"
            className="w-full justify-between border-[#0F4C3A] text-[#0F4C3A] dark:border-[#F2C94C] dark:text-[#F2C94C] bg-transparent"
          >
            <span>Support & Feedback</span>
            <ChevronRight size={16} />
          </Button>
        </div>

        {/* Save Button */}
        <Button className="w-full mt-8 bg-[#0F4C3A] hover:bg-[#0F4C3A]/90 dark:bg-[#F2C94C] dark:text-black dark:hover:bg-[#F2C94C]/90">
          Save Settings
        </Button>

        {/* App Version */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Athan Wake v1.0.0</p>
        </div>
      </div>
    </div>
  )
}
