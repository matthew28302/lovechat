'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Heart } from 'lucide-react'

export default function Home() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 500))

    if (password === '30062024') {
      // Save authentication state
      localStorage.setItem('authenticated', 'true')
      router.push('/select-user')
    } else {
      setError('Mật khẩu không đúng! Thử lại nhé 💕')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Chat Tình Yêu
            </CardTitle>
            <CardDescription className="text-gray-600">
              Nhập mật khẩu để vào thế giới riêng của chúng ta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Mật khẩu bí mật..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-pink-200 focus:border-pink-400 focus:ring-pink-200"
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center animate-pulse">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium transition-all duration-200 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang kiểm tra...
                  </div>
                ) : (
                  'Vào ngay 💕'
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Chỉ dành cho 2 người đặc biệt 💑
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}