"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Clock, Moon, Sun, BookOpen, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Alarm {
  id: string
  name: string
  time: string
  enabled: boolean
  type: "custom" | "prayer"
  prayerType?: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha"
  reciteVerseToStop: boolean
  repeatDays: string[]
  soundType: "athan" | "gentle" | "nature"
}

const PRAYER_TIMES = {
  fajr: "05:30",
  dhuhr: "12:15",
  asr: "15:45",
  maghrib: "18:30",
  isha: "20:00",
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

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
      repeatDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      soundType: "athan",
    },
    {
      id: "2",
      name: "Morning Dhikr",
      time: "07:00",
      enabled: true,
      type: "custom",
      reciteVerseToStop: false,
      repeatDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      soundType: "gentle",
    },
    {
      id: "3",
      name: "Maghrib Prayer",
      time: "18:30",
      enabled: false,
      type: "prayer",
      prayerType: "maghrib",
      reciteVerseToStop: true,
      repeatDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      soundType: "athan",
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
    repeatDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    soundType: "gentle",
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
      repeatDays: newAlarm.repeatDays ?? [],
      soundType: newAlarm.soundType ?? "gentle",
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
      repeatDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      soundType: "gentle",
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="alarm-name">Alarm Name</Label>
        <Input
          id="alarm-name"
          value={newAlarm.name || ""}
          onChange={(e) => setNewAlarm((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Enter alarm name"
          className="bg-white dark:bg-[#2A2A2A]"
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
          <SelectTrigger className="bg-white dark:bg-[#2A2A2A]">
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
            <SelectTrigger className="bg-white dark:bg-[#2A2A2A]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fajr">Fajr (الفجر)</SelectItem>
              <SelectItem value="dhuhr">Dhuhr (الظهر)</SelectItem>
              <SelectItem value="asr">Asr (العصر)</SelectItem>
              <SelectItem value="maghrib">Maghrib (المغرب)</SelectItem>
              <SelectItem value="isha">Isha (العشاء)</SelectItem>
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
            className="bg-white dark:bg-[#2A2A2A]"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Sound Type</Label>
        <Select
          value={newAlarm.soundType}
          onValueChange={(value: "athan" | "gentle" | "nature") =>
            setNewAlarm((prev) => ({ ...prev, soundType: value }))
          }
        >
          <SelectTrigger className="bg-white dark:bg-[#2A2A2A]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="athan">Athan</SelectItem>
            <SelectItem value="gentle">Gentle Bell</SelectItem>
            <SelectItem value="nature">Nature Sounds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Repeat Days</Label>
        <div className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <Button
              key={day}
              variant={newAlarm.repeatDays?.includes(day) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const currentDays = newAlarm.repeatDays || []
                const newDays = currentDays.includes(day) ? currentDays.filter((d) => d !== day) : [...currentDays, day]
                setNewAlarm((prev) => ({ ...prev, repeatDays: newDays }))
              }}
              className={cn(
                "min-w-[50px]",
                newAlarm.repeatDays?.includes(day)
                  ? "bg-[#0F4C3A] text-white dark:bg-[#F2C94C] dark:text-black"
                  : "border-[#0F4C3A] text-[#0F4C3A] dark:border-[#F2C94C] dark:text-[#F2C94C]",
              )}
            >
              {day}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-[#0F4C3A]/5 dark:bg-[#F2C94C]/5 rounded-xl">
        <div className="flex items-center gap-3">
          <BookOpen size={20} className="text-[#0F4C3A] dark:text-[#F2C94C]" />
          <div>
            <Label className="text-[#0F4C3A] dark:text-[#F2C94C] font-medium">Recite Verse to Stop</Label>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Require reciting a Quranic verse to dismiss alarm
            </p>
          </div>
        </div>
        <Switch
          checked={newAlarm.reciteVerseToStop || false}
          onCheckedChange={(checked) => setNewAlarm((prev) => ({ ...prev, reciteVerseToStop: checked }))}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={saveAlarm}
          className="flex-1 bg-[#0F4C3A] hover:bg-[#0F4C3A]/90 dark:bg-[#F2C94C] dark:text-black dark:hover:bg-[#F2C94C]/90"
        >
          {editingAlarm ? "Update Alarm" : "Add Alarm"}
        </Button>
        <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
          Cancel
        </Button>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C3A] dark:text-[#F2C94C] mb-2 font-[family-name:var(--font-amiri)]">
          المنبه
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Alarms</p>
      </div>

      {/* Add Alarm Button */}
      <Dialog open={isAddingAlarm} onOpenChange={setIsAddingAlarm}>
        <DialogTrigger asChild>
          <Button className="w-full mb-6 bg-[#0F4C3A] hover:bg-[#0F4C3A]/90 dark:bg-[#F2C94C] dark:text-black dark:hover:bg-[#F2C94C]/90">
            <Plus size={20} className="mr-2" />
            Add New Alarm
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-[#2A2A2A] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0F4C3A] dark:text-[#F2C94C]">
              {editingAlarm ? "Edit Alarm" : "Add New Alarm"}
            </DialogTitle>
          </DialogHeader>
          <AlarmForm />
        </DialogContent>
      </Dialog>

      {/* Alarms List */}
      <div className="space-y-4">
        {alarms.length === 0 ? (
          <Card className="bg-white dark:bg-[#2A2A2A] p-8 rounded-2xl shadow-sm text-center">
            <Clock size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">No alarms set</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Tap the button above to add your first alarm
            </p>
          </Card>
        ) : (
          alarms.map((alarm) => {
            const Icon = getAlarmIcon(alarm)
            return (
              <Card
                key={alarm.id}
                className={cn(
                  "p-4 rounded-xl shadow-sm transition-all",
                  alarm.enabled
                    ? "bg-white dark:bg-[#2A2A2A] border-l-4 border-[#0F4C3A] dark:border-[#F2C94C]"
                    : "bg-gray-50 dark:bg-gray-800 opacity-60",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={cn(
                        "p-3 rounded-full",
                        alarm.enabled
                          ? "bg-[#0F4C3A]/10 dark:bg-[#F2C94C]/10 text-[#0F4C3A] dark:text-[#F2C94C]"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-400",
                      )}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={cn(
                          "font-semibold",
                          alarm.enabled ? "text-[#0F4C3A] dark:text-white" : "text-gray-400",
                        )}
                      >
                        {alarm.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatTime(alarm.time)}</span>
                        {alarm.type === "prayer" && (
                          <span className="px-2 py-1 bg-[#0F4C3A]/10 dark:bg-[#F2C94C]/10 text-[#0F4C3A] dark:text-[#F2C94C] rounded text-xs">
                            Prayer
                          </span>
                        )}
                        {alarm.reciteVerseToStop && (
                          <BookOpen size={12} className="text-[#F2C94C]" title="Verse recitation required" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {alarm.repeatDays.map((day) => (
                          <span
                            key={day}
                            className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(alarm)}
                      className="text-[#0F4C3A] dark:text-[#F2C94C] hover:bg-[#0F4C3A]/10 dark:hover:bg-[#F2C94C]/10"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAlarm(alarm.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAlarm(alarm.id)}
                      className={cn(
                        "ml-2",
                        alarm.enabled
                          ? "text-[#0F4C3A] dark:text-[#F2C94C]"
                          : "text-gray-400 hover:text-[#0F4C3A] dark:hover:text-[#F2C94C]",
                      )}
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
        <Card className="bg-[#0F4C3A]/5 dark:bg-[#F2C94C]/5 p-4 rounded-xl mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#0F4C3A] dark:text-[#F2C94C] font-medium">
              {alarms.filter((a) => a.enabled).length} of {alarms.length} alarms active
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              {alarms.filter((a) => a.reciteVerseToStop).length} with verse recitation
            </span>
          </div>
        </Card>
      )}
    </div>
  )
}
