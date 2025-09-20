# 🚀 PM2 Guide - LWC Next.js Application

Hướng dẫn sử dụng PM2 để quản lý Next.js application với Socket.IO proxy.

## 📋 Tổng quan

Project này có 2 cấu hình PM2:
- **`lwc-next-dev`**: Development mode với 2 instances
- **`lwc-next`**: Production mode với max instances (tất cả CPU cores)

## 🛠️ Cài đặt PM2

```bash
# Cài đặt PM2 globally
npm install -g pm2

# Hoặc sử dụng yarn
yarn global add pm2
```

## 🎯 Các Commands cơ bản

### 1. Development Mode (2 instances)

```bash
# Khởi động development mode
pm2 start ecosystem.config.js --only lwc-next-dev

# Hoặc với environment cụ thể
pm2 start ecosystem.config.js --only lwc-next-dev --env dev_cluster

# Dừng development mode
pm2 stop lwc-next-dev

# Restart development mode
pm2 restart lwc-next-dev

# Xóa development mode
pm2 delete lwc-next-dev
```

### 2. Production Mode (max instances)

```bash
# Khởi động production mode
pm2 start ecosystem.config.js --only lwc-next

# Dừng production mode
pm2 stop lwc-next

# Restart production mode
pm2 restart lwc-next

# Xóa production mode
pm2 delete lwc-next
```

### 3. Quản lý tất cả

```bash
# Khởi động tất cả apps
pm2 start ecosystem.config.js

# Dừng tất cả apps
pm2 stop all

# Restart tất cả apps
pm2 restart all

# Xóa tất cả apps
pm2 delete all
```

## 📊 Monitoring & Logs

### Xem trạng thái

```bash
# Xem danh sách processes
pm2 list

# Xem thông tin chi tiết
pm2 show lwc-next-dev
pm2 show lwc-next

# Xem monitoring real-time
pm2 monit
```

### Xem logs

```bash
# Xem logs của development
pm2 logs lwc-next-dev

# Xem logs của production
pm2 logs lwc-next

# Xem logs tất cả
pm2 logs

# Xem logs với số dòng cụ thể
pm2 logs lwc-next-dev --lines 50

# Theo dõi logs real-time
pm2 logs lwc-next-dev --follow
```

### Log files

Development logs:
- `./logs/combined-dev.log`
- `./logs/out-dev.log`
- `./logs/error-dev.log`

Production logs:
- `./logs/combined.log`
- `./logs/out.log`
- `./logs/error.log`

## ⚙️ Cấu hình chi tiết

### Development Mode (`lwc-next-dev`)

```javascript
{
  name: 'lwc-next-dev',
  instances: 2,                    // 2 instances
  exec_mode: 'cluster',            // Cluster mode
  NODE_ENV: 'development',         // Development environment
  watch: true,                     // Auto restart khi code thay đổi
  max_memory_restart: '2G',        // Restart khi memory > 2GB
  DEV_CLUSTER: true                // Enable cluster cho dev
}
```

### Production Mode (`lwc-next`)

```javascript
{
  name: 'lwc-next',
  instances: 'max',                // Tất cả CPU cores
  exec_mode: 'cluster',            // Cluster mode
  NODE_ENV: 'production',          // Production environment
  watch: false,                    // Không auto restart
  max_memory_restart: '4G',        // Restart khi memory > 4GB
}
```

## 🔧 Environment Variables

### Development
- `NODE_ENV=development`
- `PORT=4000`
- `DEV_CLUSTER=true`

### Production
- `NODE_ENV=production`
- `PORT=4000`

## 📈 Performance Tuning

### Memory Management

```bash
# Xem memory usage
pm2 list

# Restart khi memory cao
pm2 restart lwc-next --update-env
```

### CPU Usage

```bash
# Xem CPU usage
pm2 monit

# Scale instances
pm2 scale lwc-next 4  # Scale lên 4 instances
pm2 scale lwc-next 2  # Scale xuống 2 instances
```

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
```bash
# Kiểm tra port đang sử dụng
lsof -i :4000

# Kill process sử dụng port
kill -9 <PID>
```

2. **Memory leak**
```bash
# Restart để clear memory
pm2 restart lwc-next

# Hoặc restart tất cả
pm2 restart all
```

3. **Socket.IO connection issues**
```bash
# Kiểm tra logs
pm2 logs lwc-next --lines 100

# Restart để reconnect
pm2 restart lwc-next
```

### Debug Mode

```bash
# Chạy với debug logs
pm2 start ecosystem.config.js --only lwc-next-dev --log-level debug

# Xem detailed logs
pm2 logs lwc-next-dev --lines 200
```

## 🔄 Auto Restart & Health Check

### Health Check Settings

```javascript
min_uptime: '10s',        // Minimum uptime trước khi restart
max_restarts: 10,         // Maximum restarts trong 1 phút
kill_timeout: 5000,       // Timeout khi kill process
listen_timeout: 3000      // Timeout khi start process
```

### Watch Mode (Development)

```javascript
watch: true,              // Enable file watching
watch_options: {
  usePolling: true,       // Use polling for file changes
  interval: 1000          // Check every 1 second
}
```

## 📝 Best Practices

### 1. Development Workflow

```bash
# 1. Start development
pm2 start ecosystem.config.js --only lwc-next-dev

# 2. Make changes to code
# 3. PM2 will auto restart (watch mode)

# 4. Check logs if issues
pm2 logs lwc-next-dev

# 5. Stop when done
pm2 stop lwc-next-dev
```

### 2. Production Deployment

```bash
# 1. Build application
npm run build

# 2. Start production
pm2 start ecosystem.config.js --only lwc-next

# 3. Save PM2 configuration
pm2 save

# 4. Setup startup script
pm2 startup
```

### 3. Monitoring

```bash
# Setup monitoring
pm2 install pm2-logrotate  # Auto rotate logs
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 🎯 Quick Commands Reference

| Command | Description |
|---------|-------------|
| `pm2 start ecosystem.config.js --only lwc-next-dev` | Start development |
| `pm2 start ecosystem.config.js --only lwc-next` | Start production |
| `pm2 stop lwc-next-dev` | Stop development |
| `pm2 stop lwc-next` | Stop production |
| `pm2 restart lwc-next-dev` | Restart development |
| `pm2 restart lwc-next` | Restart production |
| `pm2 logs lwc-next-dev` | View development logs |
| `pm2 logs lwc-next` | View production logs |
| `pm2 list` | List all processes |
| `pm2 monit` | Monitor real-time |
| `pm2 delete lwc-next-dev` | Delete development |
| `pm2 delete lwc-next` | Delete production |

## 🔗 Useful Links

- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [PM2 Ecosystem File](https://pm2.keymetrics.io/docs/usage/application-declaration/)
- [PM2 Monitoring](https://pm2.keymetrics.io/docs/usage/monitoring/)

---

**Lưu ý**: Luôn kiểm tra logs khi có vấn đề và sử dụng `pm2 monit` để monitor real-time performance.
