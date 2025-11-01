'use client'

import { useEffect, useState, useRef, KeyboardEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Heart, Send, Smile, Image, Check, CheckCheck, Camera, X, Mic, MicOff, Reply, ThumbsUp, Heart as HeartIcon, Laugh, Angry, Sad, Palette, ArrowDown, Sparkles, Maximize2, ZoomIn, ZoomOut } from 'lucide-react'
import TenorGifPicker from '@/components/TenorGifPicker'
import StickerPicker from '@/components/StickerPicker'

interface Message {
  id: string
  text: string
  sender: 'kit-iuuu' | 'bbi-ngo'
  timestamp: Date
  isRead: boolean
  type: 'text' | 'sticker' | 'gif' | 'image' | 'voice'
  imageUrl?: string
  voiceUrl?: string
  duration?: number
  replyTo?: string
  reactions?: Reaction[]
}

interface Reaction {
  emoji: string
  user: 'kit-iuuu' | 'bbi-ngo'
  timestamp: Date
}

interface VoiceRecording {
  blob: Blob
  duration: number
  url: string
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

// Original stickers without Mochi
const stickers = [
  // Love & Romance
  '😍', '🥰', '😘', '💕', '💖', '💗', '💓', '💝', '💞', '💘',
  '💑', '💏', '💋', '💌', '💄', '💎', '🌹', '🌸', '🌺', '🌷',
  '🦋', '🌈', '✨', '🎀', '💐', '🌹', '🎊', '🎉', '🎁', '💝',
  
  // Cute Animals
  '🐰', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🦊', '🐺',
  '🐱', '🐶', '🐭', '🐹', '🐰', '🦄', '🐴', '🐮', '🐷', '🐗',
  
  // Emotions
  '🤗', '😊', '😄', '🥺', '😭', '🙈', '😳', '🥵', '🥶', '😱',
  '🤔', '😴', '😪', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐',
  
  // Food & Love
  '🍕', '🍔', '🍟', '🍝', '🍜', '🍲', '🍱', '🍘', '🍙', '🍚',
  '🍰', '🎂', '🧁', '🍪', '🍩', '🍫', '🍬', '🍭', '🍮', '🍮',
  
  // Additional cute stickers
  '🌟', '⭐', '💫', '✨', '🌙', '☀️', '🌈', '☁️', '⛅', '🌸',
  '🏵️', '🌹', '🥀', '🌺', '🌻', '🌷', '🌱', '🌿', '🍀', '🌾',
  '🍄', '🌰', '🥜', '🌰', '🍞', '🥐', '🥖', '🥨', '🧀', '🥚',
  '🍳', '🥓', '🥞', '🌭', '🍔', '🍟', '🍕', '🥪', '🌮', '🌯',
  '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟',
  '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧',
  '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫',
  '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🍵',
  '🥤', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃'
]

// Enhanced GIF combos
const gifs = [
  // Love & Romance
  '💕❤️', '💖💗', '💝💘', '💑💏', '🥰💕', '😍❤️', '🤗💝', '💖✨',
  '🌹💐', '🦋🌸', '💕🎀', '💝🌹', '💖💗', '💓💘', '💞💕', '💖💝',
  '💑💕', '💏❤️', '💋💄', '🌹🌹', '💖💖', '✨💕', '🎊💝', '🎉💗',
  
  // Cute & Funny
  '🐰💕', '🐻❤️', '🦊💝', '🐱💖', '🐶💗', '🐼💓', '🐨💘', '🦄💞',
  '🌈🦄', '✨🦋', '🎀🐰', '💝🐻', '🌸🦊', '🌺🐱', '🌷🐶', '🦋🐼',
  
  // Emotional
  '🥺💕', '😭💔', '🤗❤️', '😊💖', '🥳🎉', '😎🔥', '🤔💭', '😴💤',
  '🥵🔥', '🥶❄️', '😱💀', '🤯🤯', '🤠🤠', '🥳🎊', '😎😎', '🤓📚'
]

// Reaction emojis
const reactions = ['❤️', '😍', '😂', '😮', '😢', '😡', '👍', '👎']

// Chat backgrounds
const chatBackgrounds = [
  { id: 'default', name: 'Mặc định', class: 'bg-gradient-to-br from-pink-50 to-purple-50' },
  { id: 'sunset', name: 'Hoàng hôn', class: 'bg-gradient-to-br from-orange-100 to-pink-100' },
  { id: 'ocean', name: 'Biển cả', class: 'bg-gradient-to-br from-blue-100 to-cyan-100' },
  { id: 'forest', name: 'Rừng xanh', class: 'bg-gradient-to-br from-green-100 to-emerald-100' },
  { id: 'lavender', name: 'Oải hương', class: 'bg-gradient-to-br from-purple-100 to-pink-100' },
  { id: 'night', name: 'Đêm sao', class: 'bg-gradient-to-br from-indigo-100 to-purple-100' },
  { id: 'candy', name: 'Kẹo ngọt', class: 'bg-gradient-to-br from-pink-100 to-rose-100' },
  { id: 'sky', name: 'Bầu trời', class: 'bg-gradient-to-br from-blue-50 to-indigo-50' }
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [currentUser, setCurrentUser] = useState<'kit-iuuu' | 'bbi-ngo' | null>(null)
  const [showStickers, setShowStickers] = useState(false)
  const [showGifs, setShowGifs] = useState(false)
  const [showTenorGifs, setShowTenorGifs] = useState(false)
  const [showNetworkStickers, setShowNetworkStickers] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [lastSeenMessage, setLastSeenMessage] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [showReactions, setShowReactions] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [voiceRecordings, setVoiceRecordings] = useState<VoiceRecording[]>([])
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState('default')
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const [imageZoom, setImageZoom] = useState(1)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const userInfo = {
    'kit-iuuu': { name: 'kịt iuuu', avatar: '🐷', color: 'from-blue-400 to-blue-600', gender: 'nam' },
    'bbi-ngo': { name: 'bbi ngố', avatar: '👶', color: 'from-pink-200 to-pink-400', gender: 'nữ' }
  }

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (!messagesContainerRef.current) return
    
    const isAtBottom = messagesContainerRef.current.scrollTop + messagesContainerRef.current.clientHeight >= 
                     messagesContainerRef.current.scrollHeight - 100
    
    // Only auto-scroll if user is already at bottom or if it's their own message
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && (isAtBottom || lastMessage.sender === currentUser)) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [messages, currentUser])

  // Handle scroll events - Show/hide scroll to bottom button
  const handleScroll = () => {
    if (!messagesContainerRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100
    
    // Show scroll to bottom button when not at bottom
    setShowScrollToBottom(!isAtBottom)
  }

  // Manual scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    setShowScrollToBottom(false)
  }

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission)
      })
    }
  }, [])

  // Show notification for new messages
  const showNotification = (message: Message) => {
    if (notificationPermission !== 'granted') return
    if (document.visibilityState === 'visible') return // Don't notify if tab is active
    if (message.sender === currentUser) return // Don't notify for own messages

    const otherUser = userInfo[message.sender]
    const notification = new Notification(`${otherUser.name} 💕`, {
      body: message.type === 'image' ? 'Đã gửi một ảnh' : 
            message.type === 'voice' ? 'Đã gửi tin nhắn thoại' : 
            message.type === 'sticker' ? 'Đã gửi một sticker' :
            message.type === 'gif' ? 'Đã gửi một GIF' : message.text,
      icon: '/favicon.ico',
      tag: 'love-chat'
    })

    setTimeout(() => notification.close(), 5000)
  }

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('authenticated')
    const savedUser = localStorage.getItem('currentUser') as 'kit-iuuu' | 'bbi-ngo' | null
    const savedBackground = localStorage.getItem('chat-background') || 'default'

    if (!isAuthenticated || !savedUser) {
      router.push('/')
      return
    }

    setCurrentUser(savedUser)
    setSelectedBackground(savedBackground)

    // Load messages from localStorage
    const savedMessages = localStorage.getItem('chat-messages')
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        reactions: msg.reactions?.map((r: any) => ({
          ...r,
          timestamp: new Date(r.timestamp)
        })) || []
      }))
      setMessages(parsedMessages)
    }

    // Simulate real-time with polling
    const interval = setInterval(() => {
      const savedMessages = localStorage.getItem('chat-messages')
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          reactions: msg.reactions?.map((r: any) => ({
            ...r,
            timestamp: new Date(r.timestamp)
          })) || []
        }))
        
        // Check for new messages
        if (parsedMessages.length > messages.length) {
          const newMessages = parsedMessages.slice(messages.length)
          newMessages.forEach((msg: Message) => {
            if (msg.sender !== savedUser) {
              showNotification(msg)
            }
          })
        }
        
        setMessages(parsedMessages)
      }
    }, 1000)

    // Mark messages as read when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && currentUser) {
        markMessagesAsRead()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [router, currentUser, messages.length, notificationPermission])

  const saveMessages = (newMessages: Message[]) => {
    localStorage.setItem('chat-messages', JSON.stringify(newMessages))
  }

  // Save background setting
  const saveBackground = (backgroundId: string) => {
    localStorage.setItem('chat-background', backgroundId)
    setSelectedBackground(backgroundId)
  }

  const markMessagesAsRead = () => {
    if (!currentUser) return
    
    const unreadMessages = messages.filter(msg => msg.sender !== currentUser && !msg.isRead)
    if (unreadMessages.length > 0) {
      const readMessages = messages.map(msg => 
        msg.sender !== currentUser && !msg.isRead ? { ...msg, isRead: true } : msg
      )
      setMessages(readMessages)
      saveMessages(readMessages)
    }
  }

  // Add reaction to message
  const addReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return
    
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji && r.user === currentUser)
        
        if (existingReaction) {
          // Remove reaction if it exists
          return {
            ...msg,
            reactions: msg.reactions?.filter(r => !(r.emoji === emoji && r.user === currentUser))
          }
        } else {
          // Add new reaction
          return {
            ...msg,
            reactions: [...(msg.reactions || []), {
              emoji,
              user: currentUser,
              timestamp: new Date()
            }]
          }
        }
      }
      return msg
    })
    
    setMessages(updatedMessages)
    saveMessages(updatedMessages)
    setShowReactions(null)
  }

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: Blob[] = []
      
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        const duration = recordingTime
        
        const newRecording: VoiceRecording = { blob, duration, url }
        setVoiceRecordings([...voiceRecordings, newRecording])
        
        // Send voice message
        sendVoiceMessage(url, duration)
        
        // Reset recording state
        setRecordingTime(0)
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current)
        }
      }
      
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      
      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Không thể truy cập micro. Vui lòng kiểm tra quyền truy cập!')
    }
  }

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  // Send voice message
  const sendVoiceMessage = (voiceUrl: string, duration: number) => {
    if (!currentUser) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: '🎤 Tin nhắn thoại',
      sender: currentUser,
      timestamp: new Date(),
      isRead: false,
      type: 'voice',
      voiceUrl,
      duration
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    saveMessages(updatedMessages)
  }

  // Reply to message
  const replyToMessage = (messageId: string) => {
    setReplyingTo(messageId)
  }

  // Cancel reply
  const cancelReply = () => {
    setReplyingTo(null)
  }

  const sendMessage = () => {
    if (!inputMessage.trim() || !currentUser) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: currentUser,
      timestamp: new Date(),
      isRead: false,
      type: 'text',
      replyTo: replyingTo || undefined
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    saveMessages(updatedMessages)
    setInputMessage('')
    setReplyingTo(null)
    setIsTyping(false)
  }

  // Send sticker
  const sendSticker = (sticker: string) => {
    if (!currentUser) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: sticker,
      sender: currentUser,
      timestamp: new Date(),
      isRead: false,
      type: 'sticker',
      replyTo: replyingTo || undefined
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    saveMessages(updatedMessages)
    setShowStickers(false)
    setReplyingTo(null)
  }

  // Send Tenor GIF
  const sendTenorGif = (gifUrl: string, previewUrl: string) => {
    if (!currentUser) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: previewUrl,
      sender: currentUser,
      timestamp: new Date(),
      isRead: false,
      type: 'gif',
      replyTo: replyingTo || undefined
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    saveMessages(updatedMessages)
    setShowTenorGifs(false)
    setReplyingTo(null)
  }

  // Send Network Sticker
  const sendNetworkSticker = (stickerUrl: string) => {
    if (!currentUser) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: stickerUrl,
      sender: currentUser,
      timestamp: new Date(),
      isRead: false,
      type: 'sticker',
      replyTo: replyingTo || undefined
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    saveMessages(updatedMessages)
    setShowNetworkStickers(false)
    setReplyingTo(null)
  }

  // Handle image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !currentUser) return

    setUploadingImage(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      const newMessage: Message = {
        id: Date.now().toString(),
        text: '📷 Đã gửi một ảnh',
        sender: currentUser,
        timestamp: new Date(),
        isRead: false,
        type: 'image',
        imageUrl,
        replyTo: replyingTo || undefined
      }

      const updatedMessages = [...messages, newMessage]
      setMessages(updatedMessages)
      saveMessages(updatedMessages)
      setUploadingImage(false)
      setReplyingTo(null)
    }
    reader.readAsDataURL(file)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle fullscreen image view
  const openFullscreenImage = (imageUrl: string) => {
    setFullscreenImage(imageUrl)
    setImageZoom(1)
  }

  const closeFullscreenImage = () => {
    setFullscreenImage(null)
    setImageZoom(1)
  }

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleZoomReset = () => {
    setImageZoom(1)
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  // Handle keyboard events
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Get background class
  const getBackgroundClass = () => {
    const background = chatBackgrounds.find(bg => bg.id === selectedBackground)
    return background?.class || chatBackgrounds[0].class
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <div className="text-white">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${getBackgroundClass()} transition-all duration-500`}>
      <div className="h-screen flex flex-col bg-white/90 backdrop-blur-sm max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className={`bg-gradient-to-r ${userInfo[currentUser].color} text-white p-4 shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{userInfo[currentUser].avatar}</div>
              <div>
                <h1 className="font-bold text-lg">{userInfo[currentUser].name}</h1>
                <p className="text-xs opacity-90">💕 Tình yêu vô tận</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBackgroundPicker(!showBackgroundPicker)}
                className="text-white hover:bg-white/20"
              >
                <Palette className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem('authenticated')
                  localStorage.removeItem('currentUser')
                  router.push('/')
                }}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Background Picker */}
        {showBackgroundPicker && (
          <div className="absolute top-16 right-4 z-50 bg-white rounded-lg shadow-xl p-3 w-48">
            <h3 className="font-medium text-gray-700 mb-2">Chọn nền</h3>
            <div className="grid grid-cols-2 gap-2">
              {chatBackgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => {
                    saveBackground(bg.id)
                    setShowBackgroundPicker(false)
                  }}
                  className={`p-2 rounded text-xs font-medium transition-all ${
                    selectedBackground === bg.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-full h-8 rounded mb-1 ${bg.class}`}></div>
                  {bg.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          {messages.map((message) => {
            const isOwn = message.sender === currentUser
            const replyingToMessage = messages.find(m => m.id === message.replyTo)
            
            return (
              <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs ${isOwn ? 'order-2' : 'order-1'}`}>
                  {/* Reply preview */}
                  {replyingToMessage && (
                    <div className={`mb-1 p-2 rounded-lg text-xs ${
                      isOwn ? 'bg-blue-100 text-blue-700 ml-auto' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <div className="font-medium">
                        Trả lời {userInfo[replyingToMessage.sender].name}
                      </div>
                      <div className="truncate">
                        {replyingToMessage.type === 'sticker' ? 'Icon' : 
                         replyingToMessage.type === 'image' ? 'Ảnh' :
                         replyingToMessage.type === 'gif' ? 'GIF' :
                         replyingToMessage.type === 'voice' ? 'Tin nhắn thoại' :
                         replyingToMessage.text}
                      </div>
                    </div>
                  )}
                  
                  <div className={`relative group ${isOwn ? 'text-right' : 'text-left'}`}>
                    <div
                      onContextMenu={(e) => {
                        e.preventDefault()
                        setShowReactions(showReactions === message.id ? null : message.id)
                      }}
                      className={`inline-block p-3 rounded-2xl ${
                        isOwn 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      } ${message.type === 'sticker' ? 'p-2' : ''} ${
                        message.reactions && message.reactions.length > 0 ? 'mb-2' : ''
                      }`}
                    >
                      {message.type === 'sticker' ? (
                        message.text.startsWith('http') ? (
                          <img src={message.text} alt="Sticker" className="w-32 h-32 object-contain" />
                        ) : (
                          <span className="text-4xl">{message.text}</span>
                        )
                      ) : message.type === 'image' ? (
                        <div className="relative group">
                          <img 
                            src={message.imageUrl} 
                            alt="Uploaded image" 
                            className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => openFullscreenImage(message.imageUrl!)}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                            <Maximize2 className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ) : message.type === 'gif' ? (
                        message.text.startsWith('http') ? (
                          <img src={message.text} alt="GIF" className="w-32 h-32 object-contain" />
                        ) : (
                          <span className="text-3xl">{message.text}</span>
                        )
                      ) : message.type === 'voice' ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Mic className="w-4 h-4" />
                          </div>
                          <div className="text-xs">
                            <div>Tin nhắn thoại</div>
                            <div>{message.duration}s</div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm">{message.text}</p>
                      )}
                    </div>
                    
                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        {message.reactions.map((reaction, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 rounded-full px-2 py-1"
                          >
                            {reaction.emoji}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Reaction picker */}
                    {showReactions === message.id && (
                      <div className={`absolute ${isOwn ? 'right-0' : 'left-0'} top-0 mt-8 bg-white rounded-lg shadow-xl p-2 flex space-x-1 z-10`}>
                        {reactions.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addReaction(message.id, emoji)}
                            className="hover:bg-gray-100 p-1 rounded text-lg"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Reply button */}
                    <button
                      onClick={() => replyToMessage(message.id)}
                      className={`absolute ${isOwn ? 'left-0' : 'right-0'} top-0 mt-8 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-lg p-1`}
                    >
                      <Reply className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {isOwn && (
                      <span>{message.isRead ? <CheckCheck className="w-3 h-3 text-blue-500" /> : <Check className="w-3 h-3 text-gray-400" />}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollToBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-20 right-4 bg-blue-500 text-white rounded-full p-2 shadow-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        )}

        {/* Reply preview */}
        {replyingTo && (
          <div className="border-t border-gray-200 p-2 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Đang trả lời:</span> {
                  messages.find(m => m.id === replyingTo)?.type === 'sticker' ? 'Icon' :
                  messages.find(m => m.id === replyingTo)?.type === 'image' ? 'Ảnh' :
                  messages.find(m => m.id === replyingTo)?.type === 'gif' ? 'GIF' :
                  messages.find(m => m.id === replyingTo)?.type === 'voice' ? 'Tin nhắn thoại' :
                  messages.find(m => m.id === replyingTo)?.text
                }
              </div>
              <Button variant="ghost" size="sm" onClick={cancelReply}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Tenor GIF Picker */}
        {showTenorGifs && (
          <TenorGifPicker
            onGifSelect={sendTenorGif}
            onClose={() => setShowTenorGifs(false)}
          />
        )}

        {/* Network Sticker Picker */}
        {showNetworkStickers && (
          <StickerPicker
            onStickerSelect={sendNetworkSticker}
            onClose={() => setShowNetworkStickers(false)}
          />
        )}

        {/* Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="text-gray-500 hover:text-gray-700"
            >
              {uploadingImage ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
              ) : (
                <Image className="w-5 h-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNetworkStickers(!showNetworkStickers)}
              className="text-gray-500 hover:text-gray-700"
              title="Icon"
            >
              <Smile className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTenorGifs(!showTenorGifs)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Sparkles className="w-5 h-5" />
            </Button>

            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value)
                  setIsTyping(e.target.value.length > 0)
                }}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn tình yêu..."
                className="pr-10"
                disabled={isRecording}
              />
            </div>

            {isRecording ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={stopRecording}
                className="animate-pulse"
              >
                <MicOff className="w-5 h-5" />
                <span className="ml-1 text-xs">{recordingTime}s</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={startRecording}
                className="text-gray-500 hover:text-gray-700"
              >
                <Mic className="w-5 h-5" />
              </Button>
            )}

            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isRecording}
              size="sm"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            {/* Close button */}
            <button
              onClick={closeFullscreenImage}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Image with zoom */}
            <div className="overflow-hidden max-w-[90vw] max-h-[80vh] flex items-center justify-center">
              <img
                src={fullscreenImage}
                alt="Fullscreen image"
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${imageZoom})` }}
              />
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black/50 rounded-full px-4 py-2">
              <button
                onClick={handleZoomOut}
                className="text-white hover:text-gray-300 transition-colors"
                disabled={imageZoom <= 0.5}
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              
              <span className="text-white text-sm min-w-[60px] text-center">
                {Math.round(imageZoom * 100)}%
              </span>
              
              <button
                onClick={handleZoomIn}
                className="text-white hover:text-gray-300 transition-colors"
                disabled={imageZoom >= 3}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleZoomReset}
                className="text-white hover:text-gray-300 transition-colors ml-2"
              >
                <span className="text-sm">Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}