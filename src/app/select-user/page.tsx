'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, User, Sparkles } from 'lucide-react'

const users = [
  {
    id: 'kit-iuuu',
    name: 'kịt iuuu',
    avatar: '🐷',
    description: 'Heo con trai',
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'bbi-ngo',
    name: 'bbi ngố',
    avatar: '👶',
    description: 'Em bé nữ đáng iu',
    color: 'from-pink-200 to-pink-400'
  }
]

export default function SelectUserPage() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if authenticated
    const isAuthenticated = localStorage.getItem('authenticated')
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [router])

  const handleSelectUser = async (userId: string) => {
    setSelectedUser(userId)
    setIsLoading(true)

    // Save selected user
    localStorage.setItem('currentUser', userId)

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 800))

    router.push('/chat')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Chọn Người Chat
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              Bạn là ai trong cuộc trò chuyện này? 💕
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    selectedUser === user.id
                      ? 'ring-4 ring-pink-300 shadow-lg'
                      : 'hover:ring-2 hover:ring-pink-200'
                  }`}
                  onClick={() => !isLoading && handleSelectUser(user.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-r ${user.color} rounded-full flex items-center justify-center text-5xl shadow-md`}>
                      {user.avatar}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {user.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {user.description}
                    </p>
                    <Button
                      className={`w-full bg-gradient-to-r ${user.color} hover:shadow-md transition-all duration-200`}
                      disabled={isLoading}
                    >
                      {isLoading && selectedUser === user.id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Đang vào...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Chọn mình
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                💝 Chọn đúng người để bắt đầu trò chuyện nhé
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}