# Store Communication System

Hệ thống giao tiếp giữa các stores sử dụng event-driven architecture để đồng bộ hóa state và thông báo giữa các components.

## Cấu trúc

### 1. Store Communication (`store-communication.ts`)
- **Singleton pattern** để quản lý events
- **Event types** định nghĩa các loại events
- **Event listeners** để lắng nghe và xử lý events
- **Helper methods** để emit events cụ thể

### 2. Store Events (`use-store-events.ts`)
- **Custom hooks** để lắng nghe events từ stores
- **Type-safe** event handling
- **Automatic cleanup** khi component unmount

### 3. Wallet Store (`wallet-store.ts`)
- **Zustand store** cho wallet state management
- **Tích hợp store communication** để emit events
- **Error handling** với event emission

## Event Types

### Binance 30s Events
- `BINANCE_30S_CANDLES_UPDATED` - Cập nhật dữ liệu nến
- `BINANCE_30S_STATS_UPDATED` - Cập nhật thống kê
- `BINANCE_30S_LATEST_UPDATED` - Cập nhật nến gần nhất
- `BINANCE_30S_TABLES_UPDATED` - Cập nhật bảng nến
- `BINANCE_30S_REALTIME_UPDATED` - Cập nhật dữ liệu real-time

### Wallet Events
- `WALLET_BALANCE_UPDATED` - Cập nhật số dư ví
- `WALLET_TRANSACTIONS_UPDATED` - Cập nhật lịch sử giao dịch
- `WALLET_DEPOSIT_CREATED` - Tạo yêu cầu nạp tiền
- `WALLET_WITHDRAWAL_CREATED` - Tạo yêu cầu rút tiền
- `WALLET_TRANSFER_COMPLETED` - Hoàn thành chuyển tiền

### System Events
- `USER_LOGGED_IN` - User đăng nhập
- `USER_LOGGED_OUT` - User đăng xuất
- `ERROR_OCCURRED` - Xảy ra lỗi

## Cách sử dụng

### 1. Lắng nghe events trong component

```tsx
import { useWalletBalanceEvents } from '@/stores'

function MyComponent() {
  useWalletBalanceEvents((balance) => {
    console.log('Balance updated:', balance)
  })
  
  return <div>...</div>
}
```

### 2. Emit events từ store

```tsx
import { storeCommunication } from './store-communication'

// Trong store action
const fetchBalance = async () => {
  try {
    const balance = await walletAPI.getBalance()
    set({ balance })
    
    // Emit event
    storeCommunication.emitWalletBalanceUpdated(balance)
  } catch (error) {
    storeCommunication.emitError(error.message, 'wallet-store')
  }
}
```

### 3. Lắng nghe tất cả events

```tsx
import { useAllStoreEvents } from '@/stores'

function EventMonitor() {
  useAllStoreEvents((event) => {
    console.log('Event received:', event)
  })
  
  return <div>...</div>
}
```

## Lợi ích

1. **Decoupling** - Components không cần biết về nhau
2. **Real-time updates** - Tự động cập nhật khi có thay đổi
3. **Error handling** - Xử lý lỗi tập trung
4. **Debugging** - Dễ dàng theo dõi events
5. **Scalability** - Dễ dàng thêm stores và events mới

## Best Practices

1. **Always emit events** sau khi cập nhật state
2. **Handle errors** và emit error events
3. **Use specific event types** thay vì generic events
4. **Clean up listeners** khi component unmount
5. **Document events** và payload structure

