"use client"

import { useState, useMemo } from "react"
import { Search, Bookmark, BookmarkCheck, Play, Pause, Volume2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Sample Surah data (in a real app, this would come from an API)
const surahs = [
  { id: 1, name: "الفاتحة", transliteration: "Al-Fatiha", translation: "The Opening", verses: 7, revelation: "Meccan" },
  { id: 2, name: "البقرة", transliteration: "Al-Baqarah", translation: "The Cow", verses: 286, revelation: "Medinan" },
  {
    id: 3,
    name: "آل عمران",
    transliteration: "Aal-E-Imran",
    translation: "The Family of Imran",
    verses: 200,
    revelation: "Medinan",
  },
  { id: 4, name: "النساء", transliteration: "An-Nisa", translation: "The Women", verses: 176, revelation: "Medinan" },
  {
    id: 5,
    name: "المائدة",
    transliteration: "Al-Ma'idah",
    translation: "The Table",
    verses: 120,
    revelation: "Medinan",
  },
  { id: 6, name: "الأنعام", transliteration: "Al-An'am", translation: "The Cattle", verses: 165, revelation: "Meccan" },
  {
    id: 7,
    name: "الأعراف",
    transliteration: "Al-A'raf",
    translation: "The Heights",
    verses: 206,
    revelation: "Meccan",
  },
  {
    id: 8,
    name: "الأنفال",
    transliteration: "Al-Anfal",
    translation: "The Spoils of War",
    verses: 75,
    revelation: "Medinan",
  },
  {
    id: 9,
    name: "التوبة",
    transliteration: "At-Tawbah",
    translation: "The Repentance",
    verses: 129,
    revelation: "Medinan",
  },
  { id: 10, name: "يونس", transliteration: "Yunus", translation: "Jonah", verses: 109, revelation: "Meccan" },
  { id: 11, name: "هود", transliteration: "Hud", translation: "Hud", verses: 123, revelation: "Meccan" },
  { id: 12, name: "يوسف", transliteration: "Yusuf", translation: "Joseph", verses: 111, revelation: "Meccan" },
]

type QuranSectionProps = {}

export default function QuranSection({}: QuranSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [bookmarkedSurahs, setBookmarkedSurahs] = useState<Set<number>>(new Set([1, 2, 12]))
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const [playingAudio, setPlayingAudio] = useState<number | null>(null)

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return surahs
    return surahs.filter(
      (surah) =>
        surah.name.includes(searchQuery) ||
        surah.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.translation.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  const toggleBookmark = (surahId: number) => {
    const newBookmarks = new Set(bookmarkedSurahs)
    if (newBookmarks.has(surahId)) {
      newBookmarks.delete(surahId)
    } else {
      newBookmarks.add(surahId)
    }
    setBookmarkedSurahs(newBookmarks)
  }

  const toggleAudio = (surahId: number) => {
    if (playingAudio === surahId) {
      setPlayingAudio(null)
    } else {
      setPlayingAudio(surahId)
    }
  }

  const openSurah = (surahId: number) => {
    setSelectedSurah(surahId)
  }

  if (selectedSurah) {
    const surah = surahs.find((s) => s.id === selectedSurah)
    if (!surah) return null

    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedSurah(null)}
            className="text-primary hover:bg-primary/10 min-w-[48px] min-h-[48px]"
            aria-label="Go back to Surah list"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-noto-naskh)]" dir="rtl">
              {surah.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {surah.transliteration} • {surah.verses} verses • {surah.revelation}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 gap-3">
          <Button
            variant="outline"
            onClick={() => setShowTranslation(!showTranslation)}
            className="bg-transparent flex-1"
            aria-label={showTranslation ? "Hide English translation" : "Show English translation"}
          >
            {showTranslation ? "Hide Translation" : "Show Translation"}
          </Button>

          <Button
            variant="outline"
            onClick={() => toggleAudio(surah.id)}
            className="bg-transparent min-w-[48px] min-h-[48px]"
            aria-label={playingAudio === surah.id ? "Pause audio recitation" : "Play audio recitation"}
          >
            {playingAudio === surah.id ? <Pause size={16} /> : <Play size={16} />}
            <Volume2 size={16} className="ml-2" />
          </Button>
        </div>

        <Card className="bg-card p-6 rounded-2xl shadow-lg">
          {/* Bismillah */}
          {surah.id !== 1 && surah.id !== 9 && (
            <div className="text-center mb-8 p-4 bg-primary/5 rounded-xl">
              <p className="text-2xl font-[family-name:var(--font-noto-naskh)] text-primary" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              {showTranslation && (
                <p className="text-sm text-muted-foreground mt-2">
                  In the name of Allah, the Most Gracious, the Most Merciful
                </p>
              )}
            </div>
          )}

          {/* Sample verses */}
          <div className="space-y-6">
            {surah.id === 1 ? (
              // Al-Fatiha verses
              <>
                <div className="text-right">
                  <p
                    className="text-xl font-[family-name:var(--font-noto-naskh)] leading-relaxed text-foreground mb-2"
                    dir="rtl"
                  >
                    الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
                  </p>
                  {showTranslation && (
                    <p className="text-sm text-muted-foreground">All praise is due to Allah, Lord of the worlds</p>
                  )}
                </div>
                <div className="text-right">
                  <p
                    className="text-xl font-[family-name:var(--font-noto-naskh)] leading-relaxed text-foreground mb-2"
                    dir="rtl"
                  >
                    الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  {showTranslation && (
                    <p className="text-sm text-muted-foreground">The Most Gracious, the Most Merciful</p>
                  )}
                </div>
                <div className="text-right">
                  <p
                    className="text-xl font-[family-name:var(--font-noto-naskh)] leading-relaxed text-foreground mb-2"
                    dir="rtl"
                  >
                    مَالِكِ يَوْمِ الدِّينِ
                  </p>
                  {showTranslation && <p className="text-sm text-muted-foreground">Master of the Day of Judgment</p>}
                </div>
              </>
            ) : (
              // Sample verses for other Surahs
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground">Full Surah content would be displayed here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {surah.verses} verses with Arabic text and optional translation
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2 font-[family-name:var(--font-noto-naskh)]" dir="rtl">
          القرآن الكريم
        </h1>
        <p className="text-muted-foreground">Holy Quran</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          type="text"
          placeholder="Search Surahs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-xl"
          aria-label="Search for Surahs by name, transliteration, or translation"
        />
      </div>

      {bookmarkedSurahs.size > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
            <BookmarkCheck size={20} aria-hidden="true" />
            Bookmarked
          </h2>
          <div className="grid gap-3">
            {surahs
              .filter((surah) => bookmarkedSurahs.has(surah.id))
              .map((surah) => (
                <Card
                  key={`bookmark-${surah.id}`}
                  className="bg-primary/5 border-primary/20 p-4 rounded-xl cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => openSurah(surah.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open bookmarked Surah ${surah.transliteration}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      openSurah(surah.id)
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded min-w-[32px] text-center">
                          {surah.id}
                        </span>
                        <div>
                          <h3
                            className="font-semibold text-foreground font-[family-name:var(--font-noto-naskh)]"
                            dir="rtl"
                          >
                            {surah.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {surah.transliteration} • {surah.verses} verses
                          </p>
                        </div>
                      </div>
                    </div>
                    <BookmarkCheck className="text-accent" size={20} aria-hidden="true" />
                  </div>
                </Card>
              ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-primary mb-4">All Surahs ({filteredSurahs.length})</h2>
        <div className="space-y-3" role="list">
          {filteredSurahs.map((surah) => (
            <Card
              key={surah.id}
              className="bg-card p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => openSurah(surah.id)}
              role="listitem button"
              tabIndex={0}
              aria-label={`Open Surah ${surah.transliteration} - ${surah.translation}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  openSurah(surah.id)
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded min-w-[32px] text-center">
                    {surah.id}
                  </span>
                  <div className="flex-1">
                    <h3
                      className="font-semibold text-foreground font-[family-name:var(--font-noto-naskh)] text-lg"
                      dir="rtl"
                    >
                      {surah.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {surah.transliteration} • {surah.translation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {surah.verses} verses • {surah.revelation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleAudio(surah.id)
                    }}
                    className="text-primary hover:bg-primary/10 min-w-[48px] min-h-[48px]"
                    aria-label={`${playingAudio === surah.id ? "Pause" : "Play"} audio for ${surah.transliteration}`}
                  >
                    {playingAudio === surah.id ? <Pause size={16} /> : <Play size={16} />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleBookmark(surah.id)
                    }}
                    className={cn(
                      "hover:bg-accent/10 min-w-[48px] min-h-[48px]",
                      bookmarkedSurahs.has(surah.id) ? "text-accent" : "text-muted-foreground",
                    )}
                    aria-label={`${bookmarkedSurahs.has(surah.id) ? "Remove bookmark from" : "Bookmark"} ${surah.transliteration}`}
                  >
                    {bookmarkedSurahs.has(surah.id) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
