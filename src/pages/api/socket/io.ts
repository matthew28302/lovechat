import { NextApiRequest, NextApiResponse } from 'next'
import { Server as NetServer } from 'http'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false
  }
}

interface Message {
  id: string
  text: string
  sender: string
  timestamp: Date
  isRead: boolean
  type: 'text' | 'sticker' | 'gif'
  room: string
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponse & { socket: any }) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    const rooms = new Map<string, Set<string>>()
    const messages = new Map<string, Message[]>()

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      socket.on('join-room', (roomId: string) => {
        socket.join(roomId)
        
        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set())
        }
        rooms.get(roomId)!.add(socket.id)

        // Send existing messages to the user
        const roomMessages = messages.get(roomId) || []
        socket.emit('load-messages', roomMessages)

        console.log(`User ${socket.id} joined room ${roomId}`)
      })

      socket.on('send-message', (message: Message) => {
        const { room, ...messageData } = message
        
        // Store message
        if (!messages.has(room)) {
          messages.set(room, [])
        }
        messages.get(room)!.push(messageData)

        // Send to all users in room except sender
        socket.to(room).emit('receive-message', messageData)
        
        console.log('Message sent to room:', room)
      })

      socket.on('mark-read', ({ messageId, room }: { messageId: string, room: string }) => {
        // Update message read status
        const roomMessages = messages.get(room)
        if (roomMessages) {
          const message = roomMessages.find(msg => msg.id === messageId)
          if (message) {
            message.isRead = true
          }
        }

        // Notify sender that message was read
        socket.to(room).emit('message-read', { messageId })
      })

      socket.on('typing', ({ room, isTyping }: { room: string, isTyping: boolean }) => {
        socket.to(room).emit('typing', { user: socket.id, isTyping })
      })

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
        
        // Remove user from all rooms
        rooms.forEach((users, roomId) => {
          if (users.has(socket.id)) {
            users.delete(socket.id)
            socket.to(roomId).emit('user-left', { userId: socket.id })
          }
        })
      })
    })

    res.socket.server.io = io
  }
  res.end()
}

export default SocketHandler