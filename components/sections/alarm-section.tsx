"use client"

import { useState } from "react"
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  Moon,
  Sun,
  BookOpen,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
  Volume2,
  Play,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface Alarm {
  id: string
  name: string
  time: string
  enabled: boolean
  type: "custom" | "prayer"
  prayerType?: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha"
  reciteVerseToStop: boolean
  verseDifficulty: "easy" | "medium" | "hard"
  snoozeEnabled: boolean
  snoozeDuration: number
  maxSnoozes: number
  repeatDays: string[]
  soundType: "athan" | "gentle" | "nature"
  volume: number
  vibration: boolean
}

const PRAYER_TIMES = {
  fajr: "05:30",
  dhuhr: "12:15",
  asr: "15:45",
  maghrib: "18:30",
  isha: "20:00",
}

const DAYS_OF_WEEK = [
  { short: "Mon", full: "Monday", arabic: "الإثنين" },
  { short: "Tue", full: "Tuesday", arabic: "الثلاثاء" },
  { short: "Wed", full: "Wednesday", arabic: "الأربعاء" },
  { short: "Thu", full: "Thursday", arabic: "الخميس" },
  { short: "Fri", full: "Friday", arabic: "الجمعة" },
  { short: "Sat", full: "Saturday", arabic: "السبت" },
  { short: "Sun", full: "Sunday", arabic: "الأحد" },
]

const VERSE_DIFFICULTIES = [
  {
    value: "easy",
    label: "Easy",
    description: "Short verses (3-5 words)",
    example: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Medium verses (6-10 words)",
    example: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ الرَّحْمَٰنِ الرَّحِيمِ",
  },
  {
    value: "hard",
    label: "Hard",
    description: "Long verses (10+ words)",
    example: "وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً",
  },
]

const SOUND_TYPES = [
  { value: "athan", label: "Athan", description: "Traditional call to prayer" },
  { value: "gentle", label: "Gentle Bell", description: "Soft chiming sound" },
  { value: "nature", label: "Nature Sounds", description: "Birds and water sounds" },
]

export default function AlarmSection() {
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: "1",
      name: "Fajr Prayer",
      time: "05:30",
      enabled: true,
      type: "prayer",
      prayerType: "fajr",
      reciteVerseToStop: true,
      verseDifficulty: "easy",
      snoozeEnabled: false,
      snoozeDuration: 5,
      maxSnoozes: 3,
      repeatDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      soundType: "athan",
      volume: 80,
      vibration: true,
    },
    {
      id: "2",
      name: "Morning Dhikr",
      time: "07:00",
      enabled: true,
      type: "custom",
      reciteVerseToStop: false,
      verseDifficulty: "medium",
      snoozeEnabled: true,
      snoozeDuration: 10,
      maxSnoozes: 2,
      repeatDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      soundType: "gentle",
      volume: 60,
      vibration: false,
    },
    {
      id: "3",
      name: "Maghrib Prayer",
      time: "18:30",
      enabled: false,
      type: "prayer",
      prayerType: "maghrib",
      reciteVerseToStop: true,
      verseDifficulty: "medium",
      snoozeEnabled: false,
      snoozeDuration: 5,
      maxSnoozes: 1,
      repeatDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      soundType: "athan",
      volume: 90,
      vibration: true,
    },
  ])

  const [isAddingAlarm, setIsAddingAlarm] = useState(false)
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null)
  const [newAlarm, setNewAlarm] = useState<Partial<Alarm>>({
    name: "",
    time: "07:00",
    enabled: true,
    type: "custom",
    reciteVerseToStop: false,
    verseDifficulty: "easy",
    snoozeEnabled: true,
    snoozeDuration: 5,
    maxSnoozes: 3,
    repeatDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    soundType: "gentle",
    volume: 70,
    vibration: true,
  })

  const toggleAlarm = (id: string) => {
    setAlarms((prev) => prev.map((alarm) => (alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm)))
  }

  const deleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id))
  }

  const saveAlarm = () => {
    if (!newAlarm.name || !newAlarm.time) return

    const alarm: Alarm = {
      id: editingAlarm?.id || Date.now().toString(),
      name: newAlarm.name!,
      time: newAlarm.time!,
      enabled: newAlarm.enabled ?? true,
      type: newAlarm.type ?? "custom",
      prayerType: newAlarm.prayerType,
      reciteVerseToStop: newAlarm.reciteVerseToStop ?? false,
      verseDifficulty: newAlarm.verseDifficulty ?? "easy",
      snoozeEnabled: newAlarm.snoozeEnabled ?? true,
      snoozeDuration: newAlarm.snoozeDuration ?? 5,
      maxSnoozes: newAlarm.maxSnoozes ?? 3,
      repeatDays: newAlarm.repeatDays ?? [],
      soundType: newAlarm.soundType ?? "gentle",
      volume: newAlarm.volume ?? 70,
      vibration: newAlarm.vibration ?? true,
    }

    if (editingAlarm) {
      setAlarms((prev) => prev.map((a) => (a.id === editingAlarm.id ? alarm : a)))
    } else {
      setAlarms((prev) => [...prev, alarm])
    }

    resetForm()
  }

  const resetForm = () => {
    setNewAlarm({
      name: "",
      time: "07:00",
      enabled: true,
      type: "custom",
      reciteVerseToStop: false,
      verseDifficulty: "easy",
      snoozeEnabled: true,
      snoozeDuration: 5,
      maxSnoozes: 3,
      repeatDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      soundType: "gentle",
      volume: 70,
      vibration: true,
    })
    setIsAddingAlarm(false)
    setEditingAlarm(null)
  }

  const startEdit = (alarm: Alarm) => {
    setEditingAlarm(alarm)
    setNewAlarm({ ...alarm })
    setIsAddingAlarm(true)
  }

  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  const getAlarmIcon = (alarm: Alarm) => {
    if (alarm.type === "prayer") {
      return alarm.prayerType === "fajr" || alarm.prayerType === "isha" ? Moon : Sun
    }
    return Clock
  }

  const AlarmForm = () => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Basic Settings */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="alarm-name">Alarm Name</Label>
          <Input
            id="alarm-name"
            value={newAlarm.name || ""}
            onChange={(e) => setNewAlarm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Enter alarm name"
            aria-describedby="alarm-name-desc"
          />
        </div>

        <div className="space-y-2">
          <Label>Alarm Type</Label>
          <Select
            value={newAlarm.type}
            onValueChange={(value: "custom" | "prayer") => {
              setNewAlarm((prev) => ({
                ...prev,
                type: value,
                time: value === "prayer" ? PRAYER_TIMES.fajr : prev.time,
                prayerType: value === "prayer" ? "fajr" : undefined,
              }))
            }}
          >
            <SelectTrigger aria-label="Select alarm type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom Time</SelectItem>
              <SelectItem value="prayer">Prayer Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {newAlarm.type === "prayer" ? (
          <div className="space-y-2">
            <Label>Prayer</Label>
            <Select
              value={newAlarm.prayerType}
              onValueChange={(value: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha") => {
                setNewAlarm((prev) => ({
                  ...prev,
                  prayerType: value,
                  time: PRAYER_TIMES[value],
                }))
              }}
            >
              <SelectTrigger aria-label="Select prayer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fajr">
                  <span className="flex items-center gap-2">
                    Fajr{" "}
                    <span className="font-[family-name:var(--font-noto-naskh)]" dir="rtl">
                      الفجر
                    </span>
                  </span>
                </SelectItem>
                <SelectItem value="dhuhr">
                  <span className="flex items-center gap-2">
                    Dhuhr{" "}
                    <span className="font-[family-name:var(--font-noto-naskh)]" dir="rtl">
                      الظهر
                    </span>
                  </span>
                </SelectItem>
                <SelectItem value="asr">
                  <span className="flex items-center gap-2">
                    Asr{" "}
                    <span className="font-[family-name:var(--font-noto-naskh)]" dir="rtl">
                      العصر
                    </span>
                  </span>
                </SelectItem>
                <SelectItem value="maghrib">
                  <span className="flex items-center gap-2">
                    Maghrib{" "}
                    <span className="font-[family-name:var(--font-noto-naskh)]" dir="rtl">
                      المغرب
                    </span>
                  </span>
                </SelectItem>
                <SelectItem value="isha">
                  <span className="flex items-center gap-2">
                    Isha{" "}
                    <span className="font-[family-name:var(--font-noto-naskh)]" dir="rtl">
                      العشاء
                    </span>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="alarm-time">Time</Label>
            <Input
              id="alarm-time"
              type="time"
              value={newAlarm.time || "07:00"}
              onChange={(e) => setNewAlarm((prev) => ({ ...prev, time: e.target.value }))}
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Sound Settings */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Sound & Vibration</h3>

        <div className="space-y-2">
          <Label>Sound Type</Label>
          <Select
            value={newAlarm.soundType}
            onValueChange={(value: "athan" | "gentle" | "nature") =>
              setNewAlarm((prev) => ({ ...prev, soundType: value }))
            }
          >
            <SelectTrigger aria-label="Select sound type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SOUND_TYPES.map((sound) => (
                <SelectItem key={sound.value} value={sound.value}>
                  <div>
                    <div className="font-medium">{sound.label}</div>
                    <div className="text-xs text-muted-foreground">{sound.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="w-full bg-transparent" aria-label="Test alarm sound">
            <Play size={14} className="mr-2" />
            Test Sound
          </Button>
        </div>

        <div className="space-y-3">
          <Label>Volume: {newAlarm.volume}%</Label>
          <Slider
            value={[newAlarm.volume || 70]}
            onValueChange={(value) => setNewAlarm((prev) => ({ ...prev, volume: value[0] }))}
            min={10}
            max={100}
            step={10}
            className="w-full"
            aria-label="Alarm volume"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Vibration</Label>
            <p className="text-xs text-muted-foreground">Enable vibration with sound</p>
          </div>
          <Switch
            checked={newAlarm.vibration || false}
            onCheckedChange={(checked) => setNewAlarm((prev) => ({ ...prev, vibration: checked }))}
            aria-label="Toggle vibration"
          />
        </div>
      </div>

      <Separator />

      {/* Repeat Days */}
      <div className="space-y-3">
        <Label>Repeat Days</Label>
        <div className="grid grid-cols-4 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <Button
              key={day.short}
              variant={newAlarm.repeatDays?.includes(day.short) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const currentDays = newAlarm.repeatDays || []
                const newDays = currentDays.includes(day.short)
                  ? currentDays.filter((d) => d !== day.short)
                  : [...currentDays, day.short]
                setNewAlarm((prev) => ({ ...prev, repeatDays: newDays }))
              }}
              className={cn(
                "min-h-[48px] flex flex-col gap-1",
                newAlarm.repeatDays?.includes(day.short) ? "bg-primary text-primary-foreground" : "bg-transparent",
              )}
              aria-label={`Toggle ${day.full}`}
            >
              <span className="text-xs">{day.short}</span>
              <span className="text-[10px] font-[family-name:var(--font-noto-naskh)]" dir="rtl">
                {day.arabic}
              </span>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Verse Recitation Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl">
          <div className="flex items-center gap-3">
            <BookOpen size={20} className="text-primary" />
            <div>
              <Label className="text-primary font-medium">Recite Verse to Stop</Label>
              <p className="text-xs text-muted-foreground">Require reciting a Quranic verse to dismiss alarm</p>
            </div>
          </div>
          <Switch
            checked={newAlarm.reciteVerseToStop || false}
            onCheckedChange={(checked) => setNewAlarm((prev) => ({ ...prev, reciteVerseToStop: checked }))}
            aria-label="Toggle verse recitation requirement"
          />
        </div>

        {newAlarm.reciteVerseToStop && (
          <div className="space-y-3 pl-4 border-l-2 border-primary/20">
            <Label>Verse Difficulty</Label>
            <Select
              value={newAlarm.verseDifficulty}
              onValueChange={(value: "easy" | "medium" | "hard") =>
                setNewAlarm((prev) => ({ ...prev, verseDifficulty: value }))
              }
            >
              <SelectTrigger aria-label="Select verse difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VERSE_DIFFICULTIES.map((difficulty) => (
                  <SelectItem key={difficulty.value} value={difficulty.value}>
                    <div className="space-y-1">
                      <div className="font-medium">{difficulty.label}</div>
                      <div className="text-xs text-muted-foreground">{difficulty.description}</div>
                      <div className="text-sm font-[family-name:var(--font-noto-naskh)]" dir="rtl">
                        {difficulty.example}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Separator />

      {/* Snooze Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RotateCcw size={20} className="text-primary" />
            <div>
              <Label className="font-medium">Enable Snooze</Label>
              <p className="text-xs text-muted-foreground">Allow snoozing the alarm</p>
            </div>
          </div>
          <Switch
            checked={newAlarm.snoozeEnabled || false}
            onCheckedChange={(checked) => setNewAlarm((prev) => ({ ...prev, snoozeEnabled: checked }))}
            aria-label="Toggle snooze functionality"
          />
        </div>

        {newAlarm.snoozeEnabled && (
          <div className="space-y-4 pl-4 border-l-2 border-primary/20">
            <div className="space-y-2">
              <Label>Snooze Duration: {newAlarm.snoozeDuration} minutes</Label>
              <Slider
                value={[newAlarm.snoozeDuration || 5]}
                onValueChange={(value) => setNewAlarm((prev) => ({ ...prev, snoozeDuration: value[0] }))}
                min={1}
                max={30}
                step={1}
                className="w-full"
                aria-label="Snooze duration in minutes"
              />
            </div>

            <div className="space-y-2">
              <Label>Maximum Snoozes: {newAlarm.maxSnoozes}</Label>
              <Slider
                value={[newAlarm.maxSnoozes || 3]}
                onValueChange={(value) => setNewAlarm((prev) => ({ ...prev, maxSnoozes: value[0] }))}
                min={1}
                max={10}
                step={1}
                className="w-full"
                aria-label="Maximum number of snoozes allowed"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={saveAlarm}
          className="flex-1 bg-primary hover:bg-primary/90 min-h-[48px]"
          aria-label={editingAlarm ? "Update alarm" : "Add new alarm"}
        >
          {editingAlarm ? "Update Alarm" : "Add Alarm"}
        </Button>
        <Button
          variant="outline"
          onClick={resetForm}
          className="flex-1 bg-transparent min-h-[48px]"
          aria-label="Cancel alarm creation"
        >
          Cancel
        </Button>
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2 font-[family-name:var(--font-noto-naskh)]" dir="rtl">
          المنبه
        </h1>
        <p className="text-muted-foreground">Alarms</p>
      </div>

      {/* Add Alarm Button */}
      <Dialog open={isAddingAlarm} onOpenChange={setIsAddingAlarm}>
        <DialogTrigger asChild>
          <Button className="w-full mb-6 bg-primary hover:bg-primary/90 min-h-[48px]" aria-label="Add new alarm">
            <Plus size={20} className="mr-2" />
            Add New Alarm
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card max-w-md max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-primary">{editingAlarm ? "Edit Alarm" : "Add New Alarm"}</DialogTitle>
          </DialogHeader>
          <AlarmForm />
        </DialogContent>
      </Dialog>

      {/* Alarms List */}
      <div className="space-y-4">
        {alarms.length === 0 ? (
          <Card className="bg-card p-8 rounded-2xl shadow-sm text-center">
            <Clock size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No alarms set</p>
            <p className="text-sm text-muted-foreground mt-1">Tap the button above to add your first alarm</p>
          </Card>
        ) : (
          alarms.map((alarm) => {
            const Icon = getAlarmIcon(alarm)
            return (
              <Card
                key={alarm.id}
                className={cn(
                  "p-4 rounded-xl shadow-sm transition-all",
                  alarm.enabled ? "bg-card border-l-4 border-primary" : "bg-muted/50 opacity-60",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={cn(
                        "p-3 rounded-full",
                        alarm.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className={cn("font-semibold", alarm.enabled ? "text-foreground" : "text-muted-foreground")}>
                        {alarm.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatTime(alarm.time)}</span>
                        {alarm.type === "prayer" && (
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">Prayer</span>
                        )}
                        {alarm.reciteVerseToStop && (
                          <BookOpen size={12} className="text-accent" title="Verse recitation required" />
                        )}
                        {alarm.snoozeEnabled && (
                          <RotateCcw size={12} className="text-muted-foreground" title="Snooze enabled" />
                        )}
                        {alarm.vibration && (
                          <Volume2 size={12} className="text-muted-foreground" title="Vibration enabled" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {alarm.repeatDays.map((day) => (
                          <span key={day} className="text-xs px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
                            {day}
                          </span>
                        ))}
                      </div>
                      {alarm.reciteVerseToStop && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Verse difficulty: {alarm.verseDifficulty}
                          {alarm.snoozeEnabled && ` • Snooze: ${alarm.snoozeDuration}min (max ${alarm.maxSnoozes})`}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(alarm)}
                      className="text-primary hover:bg-primary/10 min-w-[48px] min-h-[48px]"
                      aria-label={`Edit ${alarm.name} alarm`}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAlarm(alarm.id)}
                      className="text-destructive hover:bg-destructive/10 min-w-[48px] min-h-[48px]"
                      aria-label={`Delete ${alarm.name} alarm`}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAlarm(alarm.id)}
                      className={cn(
                        "ml-2 min-w-[48px] min-h-[48px]",
                        alarm.enabled ? "text-primary" : "text-muted-foreground hover:text-primary",
                      )}
                      aria-label={`${alarm.enabled ? "Disable" : "Enable"} ${alarm.name} alarm`}
                    >
                      {alarm.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Quick Stats */}
      {alarms.length > 0 && (
        <Card className="bg-primary/5 p-4 rounded-xl mt-6">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-primary font-medium">
                {alarms.filter((a) => a.enabled).length} of {alarms.length} alarms active
              </span>
              <span className="text-muted-foreground">
                {alarms.filter((a) => a.reciteVerseToStop).length} with verse recitation
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{alarms.filter((a) => a.snoozeEnabled).length} with snooze enabled</span>
              <span>{alarms.filter((a) => a.type === "prayer").length} prayer alarms</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
