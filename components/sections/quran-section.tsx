"use client"

import { useState, useMemo } from "react"
import { Search, Bookmark, BookmarkCheck, Play, Pause, Volume2 } from "lucide-react"
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
      <div className="p-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedSurah(null)}
            className="text-[#0F4C3A] dark:text-[#F2C94C] hover:bg-[#0F4C3A]/10 dark:hover:bg-[#F2C94C]/10"
          >
            ← Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#0F4C3A] dark:text-[#F2C94C] font-[family-name:var(--font-amiri)]">
              {surah.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {surah.transliteration} • {surah.verses} verses • {surah.revelation}
            </p>
          </div>
        </div>

        {/* Translation toggle and audio controls */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => setShowTranslation(!showTranslation)}
            className="border-[#0F4C3A] text-[#0F4C3A] dark:border-[#F2C94C] dark:text-[#F2C94C]"
          >
            {showTranslation ? "Hide Translation" : "Show Translation"}
          </Button>

          <Button
            variant="outline"
            onClick={() => toggleAudio(surah.id)}
            className="border-[#0F4C3A] text-[#0F4C3A] dark:border-[#F2C94C] dark:text-[#F2C94C]"
          >
            {playingAudio === surah.id ? <Pause size={16} /> : <Play size={16} />}
            <Volume2 size={16} className="ml-2" />
          </Button>
        </div>

        {/* Surah content */}
        <Card className="bg-white dark:bg-[#2A2A2A] p-6 rounded-2xl shadow-lg">
          {/* Bismillah */}
          {surah.id !== 1 && surah.id !== 9 && (
            <div className="text-center mb-8 p-4 bg-[#0F4C3A]/5 dark:bg-[#F2C94C]/5 rounded-xl">
              <p className="text-2xl font-[family-name:var(--font-amiri)] text-[#0F4C3A] dark:text-[#F2C94C]">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              {showTranslation && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  In the name of Allah, the Most Gracious, the Most Merciful
                </p>
              )}
            </div>
          )}

          {/* Sample verses (in a real app, this would be the full Surah) */}
          <div className="space-y-6">
            {surah.id === 1 ? (
              // Al-Fatiha verses
              <>
                <div className="text-right">
                  <p className="text-xl font-[family-name:var(--font-amiri)] leading-relaxed text-[#0F4C3A] dark:text-white mb-2">
                    الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
                  </p>
                  {showTranslation && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      All praise is due to Allah, Lord of the worlds
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-[family-name:var(--font-amiri)] leading-relaxed text-[#0F4C3A] dark:text-white mb-2">
                    الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  {showTranslation && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">The Most Gracious, the Most Merciful</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-[family-name:var(--font-amiri)] leading-relaxed text-[#0F4C3A] dark:text-white mb-2">
                    مَالِكِ يَوْمِ الدِّينِ
                  </p>
                  {showTranslation && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">Master of the Day of Judgment</p>
                  )}
                </div>
              </>
            ) : (
              // Sample verses for other Surahs
              <div className="text-center py-8">
                <p className="text-lg text-gray-500 dark:text-gray-400">Full Surah content would be displayed here</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
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
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#0F4C3A] dark:text-[#F2C94C] mb-2 font-[family-name:var(--font-amiri)]">
          القرآن الكريم
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Holy Quran</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Search Surahs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white dark:bg-[#2A2A2A] border-[#0F4C3A]/20 dark:border-[#F2C94C]/20 focus:border-[#0F4C3A] dark:focus:border-[#F2C94C] rounded-xl"
        />
      </div>

      {/* Bookmarked Surahs Section */}
      {bookmarkedSurahs.size > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#0F4C3A] dark:text-[#F2C94C] mb-3 flex items-center gap-2">
            <BookmarkCheck size={20} />
            Bookmarked
          </h2>
          <div className="grid gap-3">
            {surahs
              .filter((surah) => bookmarkedSurahs.has(surah.id))
              .map((surah) => (
                <Card
                  key={`bookmark-${surah.id}`}
                  className="bg-[#0F4C3A]/5 dark:bg-[#F2C94C]/5 border-[#0F4C3A]/20 dark:border-[#F2C94C]/20 p-4 rounded-xl cursor-pointer hover:bg-[#0F4C3A]/10 dark:hover:bg-[#F2C94C]/10 transition-colors"
                  onClick={() => openSurah(surah.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#0F4C3A] dark:text-[#F2C94C] bg-[#0F4C3A]/10 dark:bg-[#F2C94C]/10 px-2 py-1 rounded">
                          {surah.id}
                        </span>
                        <div>
                          <h3 className="font-semibold text-[#0F4C3A] dark:text-white font-[family-name:var(--font-amiri)]">
                            {surah.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {surah.transliteration} • {surah.verses} verses
                          </p>
                        </div>
                      </div>
                    </div>
                    <BookmarkCheck className="text-[#F2C94C] dark:text-[#F2C94C]" size={20} />
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* All Surahs List */}
      <div>
        <h2 className="text-lg font-semibold text-[#0F4C3A] dark:text-[#F2C94C] mb-4">
          All Surahs ({filteredSurahs.length})
        </h2>
        <div className="space-y-3">
          {filteredSurahs.map((surah) => (
            <Card
              key={surah.id}
              className="bg-white dark:bg-[#2A2A2A] p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => openSurah(surah.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium text-[#0F4C3A] dark:text-[#F2C94C] bg-[#0F4C3A]/10 dark:bg-[#F2C94C]/10 px-2 py-1 rounded min-w-[32px] text-center">
                    {surah.id}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0F4C3A] dark:text-white font-[family-name:var(--font-amiri)] text-lg">
                      {surah.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {surah.transliteration} • {surah.translation}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
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
                    className="text-[#0F4C3A] dark:text-[#F2C94C] hover:bg-[#0F4C3A]/10 dark:hover:bg-[#F2C94C]/10"
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
                      "hover:bg-[#F2C94C]/10",
                      bookmarkedSurahs.has(surah.id) ? "text-[#F2C94C]" : "text-gray-400 dark:text-gray-500",
                    )}
                  >
                    {bookmarkedSurahs.has(surah.id) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
