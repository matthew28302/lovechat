'use client'

import { useState, useEffect } from 'react'
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TenorGif {
  id: string
  media_formats: {
    tinygif: {
      url: string
      preview: string
      width: number
      height: number
    }
    gif: {
      url: string
      preview: string
      width: number
      height: number
    }
  }
  content_description: string
}

interface TenorGifPickerProps {
  onGifSelect: (gifUrl: string, previewUrl: string) => void
  onClose: () => void
}

const CATEGORIES = [
  { name: 'Love', search: 'love', emoji: '❤️' },
  { name: 'Cute', search: 'cute', emoji: '🥰' },
  { name: 'Happy', search: 'happy', emoji: '😊' },
  { name: 'Sad', search: 'sad', emoji: '😢' },
  { name: 'Angry', search: 'angry', emoji: '😠' },
  { name: 'Funny', search: 'funny', emoji: '😂' },
  { name: 'Hi', search: 'hello', emoji: '👋' },
  { name: 'Thank you', search: 'thank you', emoji: '🙏' },
  { name: 'Sorry', search: 'sorry', emoji: '😔' },
  { name: 'Miss you', search: 'miss you', emoji: '💭' },
  { name: 'Good morning', search: 'good morning', emoji: '🌅' },
  { name: 'Good night', search: 'good night', emoji: '🌙' },
  { name: 'Kiss', search: 'kiss', emoji: '💋' },
  { name: 'Hug', search: 'hug', emoji: '🤗' },
  { name: 'Love you', search: 'love you', emoji: '💕' }
]

export default function TenorGifPicker({ onGifSelect, onClose }: TenorGifPickerProps) {
  const [gifs, setGifs] = useState<TenorGif[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('love')
  const [selectedCategory, setSelectedCategory] = useState('Love')
  const [currentPage, setCurrentPage] = useState(0)

  const TENOR_API_KEY = 'AIzaSyD4Ql5V8p6q7r3s2t1u9i8o7p6q5r4s3t2'
  const LIMIT = 20

  const searchGifs = async (term: string, page: number = 0) => {
    setLoading(true)
    try {
      const pos = page * LIMIT
      const response = await fetch(
        `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(term)}&key=${TENOR_API_KEY}&client_key=love-chat-app&limit=${LIMIT}&pos=${pos}&media_filter=gif,tinygif`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch GIFs')
      }
      
      const data = await response.json()
      setGifs(data.results || [])
    } catch (error) {
      console.error('Error searching GIFs:', error)
      // Fallback to some default GIFs if API fails
      setGifs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    searchGifs(searchTerm, currentPage)
  }, [searchTerm, currentPage])

  const handleCategoryClick = (category: typeof CATEGORIES[0]) => {
    setSelectedCategory(category.name)
    setSearchTerm(category.search)
    setCurrentPage(0)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(0)
    searchGifs(searchTerm, 0)
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Chọn GIF 💫</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Categories */}
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick(category)}
                className="flex items-center gap-1"
              >
                <span>{category.emoji}</span>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm GIF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tìm...' : 'Tìm'}
            </Button>
          </form>
        </div>

        {/* GIF Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-500">Đang tải GIF...</p>
              </div>
            </div>
          ) : gifs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gifs.map((gif) => (
                <div
                  key={gif.id}
                  onClick={() => onGifSelect(gif.media_formats.gif.url, gif.media_formats.tinygif.url)}
                  className="cursor-pointer hover:opacity-80 transition-opacity rounded-lg overflow-hidden bg-gray-100 aspect-square flex items-center justify-center"
                >
                  <img
                    src={gif.media_formats.tinygif.url}
                    alt={gif.content_description}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Không tìm thấy GIF nào</p>
                <p className="text-sm text-gray-400">Thử tìm kiếm với từ khóa khác</p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {gifs.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 0 || loading}
            >
              <ChevronLeft className="w-4 h-4" />
              Trước
            </Button>
            <span className="text-sm text-gray-600">
              Trang {currentPage + 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={loading}
            >
              Tiếp
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}