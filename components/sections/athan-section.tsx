"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { MapPin, Volume2, VolumeX, Clock, Sunrise, Sun, Sunset, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Prayer times data structure
interface PrayerTime {
  name: string
  arabicName: string
  time: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  passed: boolean
}

interface PrayerTimes {
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

// Sample prayer times (in a real app, this would be calculated based on location)
const samplePrayerTimes: PrayerTimes = {
  fajr: "05:30",
  sunrise: "07:00",
  dhuhr: "12:15",
  asr: "15:45",
  maghrib: "18:30",
  isha: "20:00",
}

export default function AthanSection() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [location, setLocation] = useState("New York, NY")
  const [athanEnabled, setAthanEnabled] = useState<{ [key: string]: boolean }>({
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  })

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate prayer times with status
  const prayerTimes: PrayerTime[] = useMemo(() => {
    const now = currentTime
    const currentTimeStr = now.toTimeString().slice(0, 5)

    const prayers = [
      {
        name: "Fajr",
        arabicName: "الفجر",
        time: samplePrayerTimes.fajr,
        icon: Moon,
        passed: currentTimeStr > samplePrayerTimes.fajr,
      },
      {
        name: "Sunrise",
        arabicName: "الشروق",
        time: samplePrayerTimes.sunrise,
        icon: Sunrise,
        passed: currentTimeStr > samplePrayerTimes.sunrise,
      },
      {
        name: "Dhuhr",
        arabicName: "الظهر",
        time: samplePrayerTimes.dhuhr,
        icon: Sun,
        passed: currentTimeStr > samplePrayerTimes.dhuhr,
      },
      {
        name: "Asr",
        arabicName: "العصر",
        time: samplePrayerTimes.asr,
        icon: Sun,
        passed: currentTimeStr > samplePrayerTimes.asr,
      },
      {
        name: "Maghrib",
        arabicName: "المغرب",
        time: samplePrayerTimes.maghrib,
        icon: Sunset,
        passed: currentTimeStr > samplePrayerTimes.maghrib,
      },
      {
        name: "Isha",
        arabicName: "العشاء",
        time: samplePrayerTimes.isha,
        icon: Moon,
        passed: currentTimeStr > samplePrayerTimes.isha,
      },
    ]

    return prayers
  }, [currentTime])

  // Find next prayer
  const nextPrayer = useMemo(() => {
    const prayerList = prayerTimes.filter((prayer) => prayer.name !== "Sunrise")
    const upcomingPrayer = prayerList.find((prayer) => !prayer.passed)
    return upcomingPrayer || prayerList[0] // If all prayers passed, next is Fajr tomorrow
  }, [prayerTimes])

  // Calculate time remaining to next prayer
  const timeToNextPrayer = useMemo(() => {
    if (!nextPrayer) return "00:00:00"

    const now = currentTime
    const [hours, minutes] = nextPrayer.time.split(":").map(Number)

    const targetTime = new Date(now)
    targetTime.setHours(hours, minutes, 0, 0)

    // If the prayer time has passed today, set it for tomorrow
    if (targetTime <= now) {
      targetTime.setDate(targetTime.getDate() + 1)
    }

    const diff = targetTime.getTime() - now.getTime()
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60))
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000)

    return `${hoursLeft.toString().padStart(2, "0")}:${minutesLeft.toString().padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`
  }, [currentTime, nextPrayer])

  const toggleAthan = (prayerName: string) => {
    setAthanEnabled((prev) => ({
      ...prev,
      [prayerName.toLowerCase()]: !prev[prayerName.toLowerCase()],
    }))
  }

  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C3A] dark:text-[#F2C94C] mb-2 font-[family-name:var(--font-amiri)]">
          أوقات الصلاة
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Prayer Times</p>
      </div>

      {/* Location */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <MapPin size={16} className="text-[#0F4C3A] dark:text-[#F2C94C]" />
        <span className="text-sm text-gray-600 dark:text-gray-300">{location}</span>
      </div>

      {/* Current Time */}
      <Card className="bg-gradient-to-br from-[#0F4C3A] to-[#0F4C3A]/80 dark:from-[#F2C94C] dark:to-[#F2C94C]/80 text-white dark:text-black p-6 rounded-2xl shadow-lg mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
          <div className="text-sm opacity-90">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </Card>

      {/* Next Prayer Countdown */}
      {nextPrayer && (
        <Card className="bg-white dark:bg-[#2A2A2A] p-6 rounded-2xl shadow-lg mb-6 border-l-4 border-[#F2C94C]">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock size={20} className="text-[#0F4C3A] dark:text-[#F2C94C]" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Next Prayer</span>
            </div>
            <h3 className="text-xl font-bold text-[#0F4C3A] dark:text-white mb-1 font-[family-name:var(--font-amiri)]">
              {nextPrayer.arabicName} • {nextPrayer.name}
            </h3>
            <div className="text-lg font-semibold text-[#0F4C3A] dark:text-[#F2C94C] mb-2">
              {formatTime(nextPrayer.time)}
            </div>
            <div className="text-2xl font-mono font-bold text-[#F2C94C] dark:text-[#F2C94C]">{timeToNextPrayer}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Time Remaining</div>
          </div>
        </Card>
      )}

      {/* Prayer Times List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-[#0F4C3A] dark:text-[#F2C94C] mb-4">Today's Prayer Times</h2>

        {prayerTimes.map((prayer) => {
          const Icon = prayer.icon
          const isNextPrayer = nextPrayer?.name === prayer.name
          const canPlayAthan = prayer.name !== "Sunrise"

          return (
            <Card
              key={prayer.name}
              className={cn(
                "p-4 rounded-xl shadow-sm transition-all",
                isNextPrayer
                  ? "bg-[#0F4C3A]/10 dark:bg-[#F2C94C]/10 border-[#0F4C3A] dark:border-[#F2C94C] border-2"
                  : "bg-white dark:bg-[#2A2A2A]",
                prayer.passed && !isNextPrayer && "opacity-60",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-full",
                      isNextPrayer
                        ? "bg-[#0F4C3A] dark:bg-[#F2C94C] text-white dark:text-black"
                        : prayer.passed
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400"
                          : "bg-[#0F4C3A]/10 dark:bg-[#F2C94C]/10 text-[#0F4C3A] dark:text-[#F2C94C]",
                    )}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3
                      className={cn(
                        "font-semibold font-[family-name:var(--font-amiri)] text-lg",
                        isNextPrayer
                          ? "text-[#0F4C3A] dark:text-[#F2C94C]"
                          : prayer.passed
                            ? "text-gray-400"
                            : "text-[#0F4C3A] dark:text-white",
                      )}
                    >
                      {prayer.arabicName}
                    </h3>
                    <p
                      className={cn(
                        "text-sm",
                        isNextPrayer
                          ? "text-[#0F4C3A]/80 dark:text-[#F2C94C]/80"
                          : prayer.passed
                            ? "text-gray-400"
                            : "text-gray-600 dark:text-gray-300",
                      )}
                    >
                      {prayer.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div
                      className={cn(
                        "font-semibold",
                        isNextPrayer
                          ? "text-[#0F4C3A] dark:text-[#F2C94C]"
                          : prayer.passed
                            ? "text-gray-400"
                            : "text-[#0F4C3A] dark:text-white",
                      )}
                    >
                      {formatTime(prayer.time)}
                    </div>
                    <div
                      className={cn(
                        "text-xs",
                        isNextPrayer
                          ? "text-[#0F4C3A]/60 dark:text-[#F2C94C]/60"
                          : prayer.passed
                            ? "text-gray-400"
                            : "text-gray-500 dark:text-gray-400",
                      )}
                    >
                      {prayer.time}
                    </div>
                  </div>

                  {canPlayAthan && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAthan(prayer.name)}
                      className={cn(
                        "hover:bg-[#0F4C3A]/10 dark:hover:bg-[#F2C94C]/10",
                        athanEnabled[prayer.name.toLowerCase()]
                          ? "text-[#0F4C3A] dark:text-[#F2C94C]"
                          : "text-gray-400",
                      )}
                    >
                      {athanEnabled[prayer.name.toLowerCase()] ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </Button>
                  )}
                </div>
              </div>

              {isNextPrayer && (
                <div className="mt-3 pt-3 border-t border-[#0F4C3A]/20 dark:border-[#F2C94C]/20">
                  <div className="flex items-center justify-center gap-2 text-sm text-[#0F4C3A] dark:text-[#F2C94C]">
                    <Clock size={14} />
                    <span>Next prayer in {timeToNextPrayer}</span>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="border-[#0F4C3A] text-[#0F4C3A] dark:border-[#F2C94C] dark:text-[#F2C94C] hover:bg-[#0F4C3A]/10 dark:hover:bg-[#F2C94C]/10 bg-transparent"
        >
          <MapPin size={16} className="mr-2" />
          Update Location
        </Button>
        <Button
          variant="outline"
          className="border-[#0F4C3A] text-[#0F4C3A] dark:border-[#F2C94C] dark:text-[#F2C94C] hover:bg-[#0F4C3A]/10 dark:hover:bg-[#F2C94C]/10 bg-transparent"
        >
          <Volume2 size={16} className="mr-2" />
          Test Athan
        </Button>
      </div>
    </div>
  )
}
