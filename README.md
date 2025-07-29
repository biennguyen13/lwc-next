# Lightweight Charts với Next.js

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)](https://www.typescriptlang.org/)
[![Lightweight Charts](https://img.shields.io/badge/Lightweight%20Charts-4.2.0-green)](https://www.tradingview.com/lightweight-charts/)

🚀 Demo Next.js 14 với Lightweight Charts - Dự án hoàn chỉnh với TypeScript và Tailwind CSS.

## ✨ Tính năng

- ✅ **Candlestick Chart** - Biểu đồ nến truyền thống với dữ liệu OHLC
- ✅ **HLC Area Chart** - Biểu đồ tùy chỉnh hiển thị High, Low, Close với vùng được tô màu
- ✅ **Responsive Design** - Tự động điều chỉnh kích thước khi thay đổi màn hình
- ✅ **TypeScript Support** - Type safety đầy đủ cho development
- ✅ **Tailwind CSS** - Styling hiện đại và responsive
- ✅ **Dynamic Imports** - Tránh SSR issues với Next.js
- ✅ **Interactive Charts** - Hỗ trợ zoom, pan, và crosshair

## 🛠️ Tech Stack

- **Next.js 14** - React framework với App Router
- **Lightweight Charts 4.2** - Charting library từ TradingView
- **TypeScript 5.6** - Type safety và development experience
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **React 18.3** - UI library

## 🚀 Cài đặt

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/lwc-next-demo.git
cd lwc-next-demo

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Start production server
npm start
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 📁 Cấu trúc dự án

```
lwc-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout với metadata
│   │   ├── page.tsx        # Trang chính với tab switching
│   │   └── globals.css     # Global styles + Tailwind
│   └── components/
│       ├── Chart.tsx       # Candlestick chart component
│       └── CustomChart.tsx # HLC Area chart component
├── package.json            # Dependencies và scripts
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
└── README.md              # Documentation
```

## 📊 Sử dụng

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

## 🎨 Giao diện

- **Tab Switching**: Chuyển đổi giữa Candlestick và HLC Area chart
- **Responsive Design**: Tự động điều chỉnh layout trên mobile/desktop
- **Loading States**: Hiển thị loading khi chart đang tải
- **Modern UI**: Sử dụng Tailwind CSS với design system

## ⚙️ Cấu hình

### Next.js Config
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};
```

### TypeScript Paths
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🔧 Development

### Lưu ý quan trọng

1. **SSR Issues**: Sử dụng `dynamic` import với `ssr: false` để tránh lỗi server-side rendering
2. **Client-side only**: Lightweight Charts chỉ chạy ở browser
3. **Cleanup**: Luôn cleanup chart khi component unmount
4. **Responsive**: Tự động resize khi thay đổi kích thước màn hình

### Thêm Custom Series

```typescript
// 1. Tạo class implement ICustomSeriesPaneView
class MyCustomSeries {
  renderer() { /* ... */ }
  priceValueBuilder(data) { /* ... */ }
  isWhitespace(data) { /* ... */ }
  update() { /* ... */ }
  defaultOptions() { /* ... */ }
}

// 2. Sử dụng trong component
const customSeriesView = new MyCustomSeries();
const myCustomSeries = chart.addCustomSeries(customSeriesView, {
  // options
});
```

## 🚀 Deploy

### Vercel (Khuyến nghị)
```bash
# Deploy tự động với Vercel
npx vercel
```

### Netlify
```bash
# Build và deploy
npm run build
# Upload thư mục .next
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

- **GitHub**: [@your-username](https://github.com/your-username)
- **Email**: your-email@example.com

## 🙏 Acknowledgments

- [Lightweight Charts](https://www.tradingview.com/lightweight-charts/) - Charting library
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework 