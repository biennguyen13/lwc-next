# 🚀 LWC Next.js Application

Ứng dụng Next.js với custom server tích hợp Socket.IO, rate limiting và proxy đến backend.

## 📋 Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm >= 8.0.0
- PM2 (cho production)

## 🛠️ Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd lwc-next

# Cài đặt dependencies
npm install
```

## 🚀 Scripts có sẵn

### Development Scripts

#### 1. Chạy với Custom Server (Khuyến nghị)
```bash
npm run dev
```
- **Chức năng**: Chạy Next.js với custom server tích hợp Socket.IO
- **Port**: 4000
- **Tính năng**: 
  - Socket.IO real-time communication
  - Proxy đến backend
  - Hot reload

#### 2. Chạy Next.js Standard
```bash
npm run dev:next
```
- **Chức năng**: Chạy Next.js development server chuẩn
- **Port**: 4000
- **Lưu ý**: Không có Socket.IO và custom features

### Production Scripts

#### 1. Build ứng dụng
```bash
npm run build
```
- **Chức năng**: Build Next.js cho production
- **Tạo ra**: Thư mục `.next` với code tối ưu hóa
- **Bắt buộc**: Phải chạy trước khi start production

#### 2. Chạy Production với Custom Server
```bash
npm run start
```
- **Chức năng**: Chạy production với custom server
- **Yêu cầu**: Phải chạy `npm run build` trước
- **Tính năng**: 
  - Socket.IO
  - Proxy đến backend

#### 3. Chạy Next.js Production Standard
```bash
npm run start:next
```
- **Chức năng**: Chạy Next.js production server chuẩn
- **Yêu cầu**: Phải chạy `npm run build` trước

### Quality Scripts

```bash
npm run lint
```
- **Chức năng**: Kiểm tra code quality với ESLint

## 🔧 PM2 Configuration

### Development Mode
```bash
# Chạy app development (2 instances)
pm2 start ecosystem.config.js --only lwc-next-dev
```

### Production Mode
```bash
# Build trước
npm run build

# Chạy app production (2 instances)
pm2 start ecosystem.config.js --only lwc-next
```

### PM2 Commands
```bash
# Xem status
pm2 status

# Xem logs
pm2 logs lwc-next

# Restart
pm2 restart lwc-next

# Stop
pm2 stop lwc-next

# Delete
pm2 delete lwc-next
```

## 🌐 Environment Variables

Tạo file `.env.local`:

```env
# Next.js
NODE_ENV=development
PORT=4000

# Backend API
API_SERVER_URL=http://localhost:4001

# Socket.IO
SOCKET_SERVER_URL=http://localhost:4002
NEXT_SERVER_URL=http://localhost:4000

# PM2
INSTANCE_ID=0
DEV_CLUSTER=true
```

## 📁 Cấu trúc dự án

```
lwc-next/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── trading/        # Trading page
│   │   └── dashboard/      # Dashboard page
│   ├── components/         # React components
│   ├── stores/            # Zustand stores
│   └── lib/               # Utilities
├── server.mjs             # Custom server
├── ecosystem.config.js    # PM2 configuration
└── package.json
```

## 🔌 Custom Server Features

### Socket.IO Integration
- Real-time communication với backend
- Event forwarding
- Connection management

### Request Logging
- HTTP requests logging với timestamps
- Socket.IO events logging (chỉ development)
- Query parameters logging
- IP address tracking

### Proxy
- Forward requests đến backend API
- Handle authentication
- Error handling

## 🚨 Troubleshooting

### Port đã được sử dụng
```bash
# Tìm process sử dụng port 4000
lsof -i :4000

# Kill process
kill -9 <PID>
```

### PM2 issues
```bash
# Reset PM2
pm2 kill
pm2 start ecosystem.config.js
```

### Build errors
```bash
# Clear cache
rm -rf .next
npm run build
```

## 📊 Monitoring

### Logs
```bash
# Xem logs real-time
pm2 logs lwc-next --lines 50

# Xem logs file
tail -f logs/combined.log
```

### Performance
```bash
# Xem PM2 status
pm2 monit

# Xem memory usage
pm2 show lwc-next
```

## 🔄 Development Workflow

1. **Start development**:
   ```bash
   npm run dev
   ```

2. **Make changes** trong `/src/`

3. **Test** trên `http://localhost:4000`

4. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

5. **Deploy với PM2**:
   ```bash
   pm2 start ecosystem.config.js --env production
   ```

## 📝 Notes

- **Custom Server** được khuyến nghị cho development và production
- **Next.js Standard** chỉ dùng khi không cần Socket.IO
- **PM2** cần thiết cho production với cluster mode
- **Request logging** tự động log tất cả HTTP requests và Socket.IO events

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License
