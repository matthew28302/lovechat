'use client'

import { useState, useEffect } from 'react'
import { X, Heart, Smile, Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface StickerPickerProps {
  onStickerSelect: (stickerUrl: string) => void
  onClose: () => void
}

// Enhanced icon sets
const iconCategories = [
  {
    name: 'Faces',
    icons: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨']
  },
  {
    name: 'Love',
    icons: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐']
  },
  {
    name: 'Animals',
    icons: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺']
  },
  {
    name: 'Food',
    icons: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔']
  },
  {
    name: 'Activities',
    icons: ['⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳️', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌']
  },
  {
    name: 'Objects',
    icons: ['⌚️', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️']
  },
  {
    name: 'Symbols',
    icons: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈️', '♉️', '♊️', '♋️', '♌️', '♍️', '♎️', '♏️', '♐️', '♑️', '♒️', '♓️', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕️', '🛑', '⛔️', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗️', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿️', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '👁️‍🗨️', '🔚', '🔙', '🔛', '🔝', '🔜', '〰️', '➰', '➿', '✔️', '☑️', '🔘', '⚪️', '⚫️', '🔴', '🔵', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '⬛️', '⬜️', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄️', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧']
  }
]

// Tenor suggested searches
const suggestedSearches = [
  'love', 'cute', 'happy', 'funny', 'hello', 'thank you', 
  'sorry', 'good morning', 'good night', 'miss you', 'hug', 'kiss'
]

interface TenorGif {
  id: string
  title: string
  media_formats: {
    gif?: {
      url: string
      preview: string
      size: number
    }
    tinygif?: {
      url: string
      preview: string
      size: number
    }
    nanogif?: {
      url: string
      preview: string
      size: number
    }
  }
}

export default function StickerPicker({ onStickerSelect, onClose }: StickerPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState(iconCategories[0])
  const [activeTab, setActiveTab] = useState<'icons' | 'gifs'>('icons')
  const [gifs, setGifs] = useState<TenorGif[]>([])
  const [loadingGifs, setLoadingGifs] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const TENOR_API_KEY = 'AIzaSyD2ruwJ3znuifgNaiHZ8Gni-czmevLEJ88'
  const TENOR_CLIENT_KEY = 'love-chat-app'

  const fetchGifs = async (searchTerm: string) => {
    setLoadingGifs(true)
    try {
      const limit = 20
      // Use the search endpoint with proper parameters
      const url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(searchTerm)}&key=${TENOR_API_KEY}&client_key=${TENOR_CLIENT_KEY}&limit=${limit}&media_filter=basic,tinygif,gif&contentfilter=high`
      
      console.log('Fetching GIFs from:', url)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Tenor API error:', response.status, errorText)
        setGifs([])
        return
      }
      
      const data = await response.json()
      console.log('Tenor API response:', data)
      
      if (data.results && Array.isArray(data.results)) {
        setGifs(data.results)
      } else {
        console.log('No results found or invalid response format')
        setGifs([])
      }
    } catch (error) {
      console.error('Error fetching GIFs:', error)
      setGifs([])
    } finally {
      setLoadingGifs(false)
    }
  }

  const handleImageError = (url: string) => {
    setImageErrors(prev => new Set(prev).add(url))
  }

  const renderIcon = (icon: string, index: number) => {
    return (
      <div
        key={index}
        onClick={() => onStickerSelect(icon)}
        className="text-3xl hover:bg-gray-100 p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-center aspect-square"
      >
        {icon}
      </div>
    )
  }

  const renderGif = (gif: TenorGif, index: number) => {
    // Try to get the best available format
    let gifUrl = gif.media_formats.nanogif?.url || 
                 gif.media_formats.tinygif?.url || 
                 gif.media_formats.gif?.url
    
    if (!gifUrl || imageErrors.has(gifUrl)) {
      return null
    }

    return (
      <div
        key={gif.id || index}
        onClick={() => onStickerSelect(gifUrl)}
        className="hover:bg-gray-100 p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-center aspect-square bg-gray-50"
      >
        <img
          src={gifUrl}
          alt={gif.title || `GIF ${index + 1}`}
          className="w-full h-full object-contain"
          onError={() => handleImageError(gifUrl)}
          loading="lazy"
        />
      </div>
    )
  }

  // Load initial GIFs when switching to GIFs tab
  useEffect(() => {
    if (activeTab === 'gifs' && gifs.length === 0) {
      fetchGifs('love') // Load default love GIFs
    }
  }, [activeTab])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      fetchGifs(searchQuery.trim())
    }
  }

  const handleSuggestedSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm)
    fetchGifs(searchTerm)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Icon và GIF dễ thương
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b">
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'icons' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab('icons')}
              className="flex items-center gap-1"
            >
              <Smile className="w-4 h-4" />
              <span>Icon</span>
            </Button>
            <Button
              variant={activeTab === 'gifs' ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab('gifs')}
              className="flex items-center gap-1"
            >
              <Heart className="w-4 h-4" />
              <span>GIF</span>
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            {activeTab === 'icons' ? (
              iconCategories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory.name === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-1"
                >
                  <span>{category.name}</span>
                </Button>
              ))
            ) : (
              <div className="w-full space-y-3">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Tìm kiếm GIF..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit" size="sm" disabled={loadingGifs}>
                    {loadingGifs ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </form>
                
                {/* Suggested Searches */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Gợi ý tìm kiếm:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSearches.map((searchTerm) => (
                      <Button
                        key={searchTerm}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestedSearch(searchTerm)}
                        className="text-xs"
                      >
                        {searchTerm}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loadingGifs && activeTab === 'gifs' ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500 mx-auto mb-2" />
                <p className="text-gray-500">Đang tải GIF...</p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {activeTab === 'icons' ? (
                  selectedCategory.icons.map((icon, index) => 
                    renderIcon(icon, index)
                  )
                ) : (
                  gifs.map((gif, index) => 
                    renderGif(gif, index)
                  )
                )}
              </div>
              
              {activeTab === 'gifs' && gifs.length === 0 && !loadingGifs && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Không tìm thấy GIF nào</p>
                  <p className="text-sm text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
                </div>
              )}
            </ScrollArea>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <p className="text-center text-sm text-gray-500">
            💕 Chọn {activeTab === 'icons' ? 'icon' : 'GIF'} để gửi cho người thương
          </p>
        </div>
      </div>
    </div>
  )
}