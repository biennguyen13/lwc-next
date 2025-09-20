import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'
import { io as ClientIO } from 'socket.io-client'
import cluster from 'cluster'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 4000

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

// Cluster support
const isCluster = (process.env.NODE_ENV === 'production' || process.env.DEV_CLUSTER) && cluster.isWorker

// Initialize Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Backend Socket.IO connection
let backendSocket = null

// Initialize backend connection
const initBackendConnection = () => {
  if (backendSocket) return backendSocket

  const backendSocketUrl = process.env.SOCKET_SERVER_URL || 'http://localhost:4002'
  
  console.log('🔌 Connecting to backend Socket.IO server:', backendSocketUrl)
  
  backendSocket = ClientIO(backendSocketUrl, {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    forceNew: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    autoConnect: true,
  })

  backendSocket.on('connect', () => {
    console.log('✅ Connected to backend Socket.IO server')
  })

  backendSocket.on('disconnect', () => {
    console.log('❌ Disconnected from backend Socket.IO server')
  })

  backendSocket.on('connect_error', (error) => {
    console.error('❌ Backend connection error:', error)
  })

  return backendSocket
}

app.prepare().then(() => {
  // Create HTTP server
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.IO server with cluster support
  const io = new Server(httpServer, {
    path: '/api/socketio',
    cors: {
      origin: process.env.NEXT_SERVER_URL || `http://localhost:${port}`,
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    // Cluster mode configuration
    allowEIO3: true
  })

  // Initialize backend connection
  const backend = initBackendConnection()

  // Handle Socket.IO connections
  io.on('connection', (socket) => {
    console.log('👤 Frontend client connected:', socket.id)

    // Forward all events from frontend to backend
    socket.onAny((eventName, ...args) => {
      console.log(`📤 Forwarding event '${eventName}' to backend`)
      if (backend && backend.connected) {
        backend.emit(eventName, ...args)
      } else {
        console.warn('⚠️ Backend not connected, cannot forward event:', eventName)
      }
    })

    // Forward all events from backend to frontend
    const forwardEvent = (eventName, ...args) => {
      console.log(`📥 Forwarding event '${eventName}' to frontend (${socket.id})`)
      socket.emit(eventName, ...args)
    }
    
    backend.onAny(forwardEvent)

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('👋 Frontend client disconnected:', socket.id)
      // Cleanup event listener to prevent memory leak
      backend.offAny(forwardEvent)
    })
  })

  // Start server
  httpServer.listen(port, (err) => {
    if (err) throw err
    const instanceId = process.env.INSTANCE_ID || 'single'
    console.log(`🚀 Ready on http://${hostname}:${port} (Instance: ${instanceId})`)
    console.log(`🔌 Socket.IO server running on /api/socketio`)
  })
})
