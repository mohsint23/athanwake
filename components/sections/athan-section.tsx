"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { MapPin, Volume2, VolumeX, Clock, Sunrise, Sun, Sunset, Moon, Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface LocationData {
  city: string
  country: string
  latitude: number
  longitude: number
}

interface HijriDate {
  day: number
  month: string
  year: number
  monthNumber: number
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

const hijriMonths = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الثاني",
  "جمادى الأولى",
  "جمادى الثانية",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
]

const calculationMethods = [
  { value: "mwl", label: "Muslim World League" },
  { value: "isna", label: "Islamic Society of North America" },
  { value: "egypt", label: "Egyptian General Authority" },
  { value: "makkah", label: "Umm Al-Qura University, Makkah" },
  { value: "karachi", label: "University of Islamic Sciences, Karachi" },
]

const asrMethods = [
  { value: "standard", label: "Standard (Shafi, Maliki, Hanbali)" },
  { value: "hanafi", label: "Hanafi" },
]

export default function AthanSection() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [location, setLocation] = useState<LocationData | null>(null)
  const [locationError, setLocationError] = useState<string>("")
  const [manualLocation, setManualLocation] = useState("")
  const [calculationMethod, setCalculationMethod] = useState("mwl")
  const [asrMethod, setAsrMethod] = useState("standard")
  const [athanEnabled, setAthanEnabled] = useState<{ [key: string]: boolean }>({
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  })
  const [isPlayingAthan, setIsPlayingAthan] = useState(false)
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null)

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        })
      })

      // In a real app, you would reverse geocode these coordinates
      const mockLocation: LocationData = {
        city: "New York",
        country: "United States",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }

      setLocation(mockLocation)
      setLocationError("")
    } catch (error) {
      setLocationError("Unable to get your location. Please enter manually.")
    }
  }, [])

  const calculateHijriDate = useCallback((gregorianDate: Date): HijriDate => {
    // Simplified Hijri calculation (in a real app, use a proper library)
    const hijriEpoch = new Date(622, 6, 16) // July 16, 622 CE
    const daysDiff = Math.floor((gregorianDate.getTime() - hijriEpoch.getTime()) / (1000 * 60 * 60 * 24))
    const hijriYear = Math.floor(daysDiff / 354.37) + 1
    const dayOfYear = daysDiff % 354
    const monthNumber = Math.floor(dayOfYear / 29.5)
    const dayOfMonth = Math.floor(dayOfYear % 29.5) + 1

    return {
      day: dayOfMonth,
      month: hijriMonths[monthNumber] || hijriMonths[0],
      year: hijriYear,
      monthNumber: monthNumber + 1,
    }
  }, [])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      setHijriDate(calculateHijriDate(now))
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateHijriDate])

  // Request location on mount
  useEffect(() => {
    requestLocation()
  }, [requestLocation])

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

  // Calculate time remaining to next prayer and progress
  const { timeToNextPrayer, progressPercentage } = useMemo(() => {
    if (!nextPrayer) return { timeToNextPrayer: "00:00:00", progressPercentage: 0 }

    const now = currentTime
    const [hours, minutes] = nextPrayer.time.split(":").map(Number)

    const targetTime = new Date(now)
    targetTime.setHours(hours, minutes, 0, 0)

    // If the prayer time has passed today, set it for tomorrow
    if (targetTime <= now) {
      targetTime.setDate(targetTime.getDate() + 1)
    }

    const diff = targetTime.getTime() - now.getTime()
    const totalMinutesToNext = Math.floor(diff / (1000 * 60))

    // Calculate progress (assuming 6 hours between prayers for demo)
    const progressPercent = Math.max(0, Math.min(100, ((360 - totalMinutesToNext) / 360) * 100))

    const hoursLeft = Math.floor(diff / (1000 * 60 * 60))
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000)

    return {
      timeToNextPrayer: `${hoursLeft.toString().padStart(2, "0")}:${minutesLeft.toString().padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`,
      progressPercentage: progressPercent,
    }
  }, [currentTime, nextPrayer])

  const toggleAthan = (prayerName: string) => {
    setAthanEnabled((prev) => ({
      ...prev,
      [prayerName.toLowerCase()]: !prev[prayerName.toLowerCase()],
    }))
  }

  const playAthan = () => {
    setIsPlayingAthan(!isPlayingAthan)
    // In a real app, this would play/pause the actual Athan audio
  }

  const formatTime = (time24: string) => {
    const [hours, minutes] = time24.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Header with Hijri Date */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2 font-[family-name:var(--font-noto-naskh)]" dir="rtl">
          أوقات الصلاة
        </h1>
        <p className="text-muted-foreground mb-2">Prayer Times</p>
        {hijriDate && (
          <div className="text-sm text-muted-foreground" dir="rtl">
            <span className="font-[family-name:var(--font-noto-naskh)]">
              {hijriDate.day} {hijriDate.month} {hijriDate.year} هـ
            </span>
          </div>
        )}
      </div>

      {/* Location with Error Handling */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MapPin size={16} className="text-primary" />
          <span className="text-sm text-muted-foreground">
            {location ? `${location.city}, ${location.country}` : "Getting location..."}
          </span>
        </div>
        {locationError && (
          <div className="text-center">
            <p className="text-xs text-destructive mb-2">{locationError}</p>
            <Button variant="outline" size="sm" onClick={requestLocation} className="text-xs bg-transparent">
              <RotateCcw size={12} className="mr-1" />
              Retry Location
            </Button>
          </div>
        )}
      </div>

      {/* Current Time */}
      <Card className="bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2 font-mono">
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

      {/* Enhanced Next Prayer Card with Progress Ring */}
      {nextPrayer && (
        <Card className="bg-card p-8 rounded-2xl shadow-lg mb-6 border-l-4 border-accent relative overflow-hidden">
          {/* Progress Ring Background */}
          <div className="absolute top-4 right-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-muted/20"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercentage / 100)}`}
                  className="text-accent transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-accent">{Math.round(progressPercentage)}%</span>
              </div>
            </div>
          </div>

          <div className="text-center pr-20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock size={20} className="text-primary" />
              <span className="text-sm text-muted-foreground">Next Prayer</span>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2 font-[family-name:var(--font-noto-naskh)]" dir="rtl">
              {nextPrayer.arabicName}
            </h3>
            <p className="text-lg font-semibold text-foreground mb-1">{nextPrayer.name}</p>
            <div className="text-xl font-semibold text-primary mb-3">{formatTime(nextPrayer.time)}</div>
            <div className="text-3xl font-mono font-bold text-accent mb-2">{timeToNextPrayer}</div>
            <div className="text-xs text-muted-foreground mb-4">Time Remaining</div>

            {/* Play Athan Button */}
            <Button
              onClick={playAthan}
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6"
              aria-label={isPlayingAthan ? "Pause Athan" : "Play Athan"}
            >
              {isPlayingAthan ? (
                <>
                  <Pause size={16} className="mr-2" />
                  Pause Athan
                </>
              ) : (
                <>
                  <Play size={16} className="mr-2" />
                  Play Athan
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Calculation Methods */}
      <div className="mb-6 space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Calculation Method</label>
          <Select value={calculationMethod} onValueChange={setCalculationMethod}>
            <SelectTrigger className="w-full">
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
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Asr Calculation</label>
          <Select value={asrMethod} onValueChange={setAsrMethod}>
            <SelectTrigger className="w-full">
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
        </div>
      </div>

      {/* Prayer Times List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-primary mb-4">Today's Prayer Times</h2>

        {prayerTimes.map((prayer) => {
          const Icon = prayer.icon
          const isNextPrayer = nextPrayer?.name === prayer.name
          const canPlayAthan = prayer.name !== "Sunrise"

          return (
            <Card
              key={prayer.name}
              className={cn(
                "p-4 rounded-xl shadow-sm transition-all",
                isNextPrayer ? "bg-primary/10 border-primary border-2" : "bg-card",
                prayer.passed && !isNextPrayer && "opacity-60",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-full",
                      isNextPrayer
                        ? "bg-primary text-primary-foreground"
                        : prayer.passed
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/10 text-primary",
                    )}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3
                      className={cn(
                        "font-semibold font-[family-name:var(--font-noto-naskh)] text-lg",
                        isNextPrayer ? "text-primary" : prayer.passed ? "text-muted-foreground" : "text-foreground",
                      )}
                      dir="rtl"
                    >
                      {prayer.arabicName}
                    </h3>
                    <p
                      className={cn(
                        "text-sm",
                        isNextPrayer
                          ? "text-primary/80"
                          : prayer.passed
                            ? "text-muted-foreground"
                            : "text-muted-foreground",
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
                        isNextPrayer ? "text-primary" : prayer.passed ? "text-muted-foreground" : "text-foreground",
                      )}
                    >
                      {formatTime(prayer.time)}
                    </div>
                    <div className={cn("text-xs", isNextPrayer ? "text-primary/60" : "text-muted-foreground")}>
                      {prayer.time}
                    </div>
                  </div>

                  {canPlayAthan && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAthan(prayer.name)}
                      className={cn(
                        "hover:bg-primary/10 min-w-[48px] min-h-[48px]",
                        athanEnabled[prayer.name.toLowerCase()] ? "text-primary" : "text-muted-foreground",
                      )}
                      aria-label={`${athanEnabled[prayer.name.toLowerCase()] ? "Disable" : "Enable"} Athan for ${prayer.name}`}
                    >
                      {athanEnabled[prayer.name.toLowerCase()] ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
