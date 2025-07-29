# Lightweight Charts với Next.js

Dự án demo sử dụng Lightweight Charts trong Next.js 14 với TypeScript.

## Tính năng

- ✅ Candlestick Chart (biểu đồ nến)
- ✅ HLC Area Chart (biểu đồ tùy chỉnh)
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Tailwind CSS styling
- ✅ Dynamic imports để tránh SSR issues

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Start production server
npm start
```

## Cấu trúc dự án

```
lwc-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Trang chính
│   │   └── globals.css     # Global styles
│   └── components/
│       ├── Chart.tsx       # Candlestick chart component
│       └── CustomChart.tsx # HLC Area chart component
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Sử dụng

### Candlestick Chart

```typescript
import Chart from '@/components/Chart';

const data = [
  { time: '2023-01-01', open: 100, high: 110, low: 90, close: 105 },
  { time: '2023-01-02', open: 105, high: 115, low: 95, close: 110 },
];

<Chart data={data} title="Biểu đồ giá" />
```

### Custom Chart (HLC Area)

```typescript
import CustomChart from '@/components/CustomChart';

const data = [
  { time: '2023-01-01', high: 110, low: 90, close: 105 },
  { time: '2023-01-02', high: 115, low: 95, close: 110 },
];

<CustomChart data={data} title="HLC Area Chart" />
```

## Lưu ý quan trọng

1. **SSR Issues**: Sử dụng `dynamic` import với `ssr: false` để tránh lỗi server-side rendering
2. **Client-side only**: Lightweight Charts chỉ chạy ở browser
3. **Cleanup**: Luôn cleanup chart khi component unmount
4. **Responsive**: Tự động resize khi thay đổi kích thước màn hình

## Công nghệ sử dụng

- **Next.js 14**: React framework với App Router
- **TypeScript**: Type safety
- **Lightweight Charts**: Charting library
- **Tailwind CSS**: Utility-first CSS framework

## Mở rộng

Để thêm custom series mới:

1. Tạo class implement `ICustomSeriesPaneView`
2. Tạo component React với dynamic import
3. Sử dụng `chart.addCustomSeries()` để thêm vào chart

## License

MIT 