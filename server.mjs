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
  const timestamp = new Date().toISOString()
  
  console.log(`🔌 [${timestamp}] Initializing backend Socket.IO connection`)
  console.log(`   🌐 Backend URL: ${backendSocketUrl}`)
  
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
    const connectTimestamp = new Date().toISOString()
    console.log(`✅ [${connectTimestamp}] Backend Socket.IO connected successfully`)
    console.log(`   🆔 Socket ID: ${backendSocket.id}`)
  })

  backendSocket.on('disconnect', (reason) => {
    const disconnectTimestamp = new Date().toISOString()
    console.log(`❌ [${disconnectTimestamp}] Backend Socket.IO disconnected`)
    console.log(`   📝 Reason: ${reason}`)
  })

  backendSocket.on('connect_error', (error) => {
    const errorTimestamp = new Date().toISOString()
    console.error(`❌ [${errorTimestamp}] Backend connection error:`)
    console.error(`   🚨 Error: ${error.message}`)
    console.error(`   🔗 URL: ${backendSocketUrl}`)
  })

  return backendSocket
}

app.prepare().then(() => {
  // Create HTTP server
  const httpServer = createServer(async (req, res) => {
    try {
      const url = req.url || '/'
      const parsedUrl = parse(url, true)
      const pathname = parsedUrl.pathname || '/'
      const method = req.method || 'GET'
      
      // Log request với format đẹp
      const timestamp = new Date().toISOString()
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'
      
      dev && console.log(`🌐 [${timestamp}] ${method} ${pathname} - IP: ${ip}`)
      
      // Log query parameters nếu có
      if (Object.keys(parsedUrl.query).length > 0) {
        dev && console.log(`   📋 Query:`, parsedUrl.query)
      }
      
      await handle(req, res, parsedUrl)
      
      // Log response status
      dev && console.log(`✅ [${timestamp}] ${method} ${pathname} - Status: ${res.statusCode}`)
      
    } catch (err) {
      const timestamp = new Date().toISOString()
      const url = req.url || '/'
      const method = req.method || 'GET'
      console.error(`❌ [${timestamp}] Error handling ${method} ${url}:`, err.message)
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
    const timestamp = new Date().toISOString()
    const clientIP = socket.handshake.address || 'unknown'
    
    console.log(`🔌 [${timestamp}] Socket.IO client connected`)
    console.log(`   📍 Socket ID: ${socket.id}`)
    console.log(`   🌐 Client IP: ${clientIP}`)
    console.log(`   📱 User Agent: ${socket.handshake.headers['user-agent'] || 'unknown'}`)

    // Forward all events from frontend to backend
    socket.onAny((eventName, ...args) => {
      const eventTimestamp = new Date().toISOString()
      console.log(`📤 [${eventTimestamp}] Event: ${eventName} → Backend`)
      console.log(`   🔗 Socket: ${socket.id}`)
      
      if (backend && backend.connected) {
        backend.emit(eventName, ...args)
      } else {
        console.warn(`⚠️ [${eventTimestamp}] Backend not connected, cannot forward: ${eventName}`)
      }
    })

    // Forward all events from backend to frontend
    const forwardEvent = (eventName, ...args) => {
      const eventTimestamp = new Date().toISOString()
      // console.log(`📥 [${eventTimestamp}] Event: ${eventName} → Frontend`)
      // console.log(`   🔗 Socket: ${socket.id}`)
      socket.emit(eventName, ...args)
    }
    
    backend.onAny(forwardEvent)

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      const disconnectTimestamp = new Date().toISOString()
      console.log(`👋 [${disconnectTimestamp}] Socket.IO client disconnected`)
      console.log(`   📍 Socket ID: ${socket.id}`)
      console.log(`   📝 Reason: ${reason}`)
      
      // Cleanup event listener to prevent memory leak
      backend.offAny(forwardEvent)
    })
  })

  // Start server
  httpServer.listen(port, (err) => {
    if (err) throw err
    const instanceId = process.env.INSTANCE_ID || 'single'
    const startTimestamp = new Date().toISOString()
    
    console.log(`🚀 [${startTimestamp}] Next.js server started successfully`)
    console.log(`   🌐 URL: http://${hostname}:${port}`)
    console.log(`   🆔 Instance: ${instanceId}`)
    console.log(`   🔧 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`   🔌 Socket.IO: /api/socketio`)
    console.log(`   📊 Rate Limiting: Enabled`)
    console.log(`   ⚡ Cluster Mode: ${isCluster ? 'Yes' : 'No'}`)
  })
})
