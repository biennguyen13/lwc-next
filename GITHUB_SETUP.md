# Hướng dẫn tạo GitHub Repository

## Bước 1: Tạo Repository trên GitHub

1. Truy cập [GitHub.com](https://github.com)
2. Click vào nút **"New"** hoặc **"+"** ở góc trên bên phải
3. Chọn **"New repository"**

## Bước 2: Cấu hình Repository

### Thông tin cơ bản:
- **Repository name**: `lwc-next-demo` (hoặc tên bạn muốn)
- **Description**: `Next.js 14 với Lightweight Charts demo`
- **Visibility**: Public (hoặc Private tùy bạn)
- **Initialize with**: ❌ KHÔNG check bất kỳ option nào

### Advanced Settings (tùy chọn):
- ✅ **Add a README file** (nếu muốn)
- ✅ **Add .gitignore** (chọn Node)
- ✅ **Choose a license** (MIT)

## Bước 3: Tạo Repository

Click **"Create repository"**

## Bước 4: Push code lên GitHub

Sau khi tạo repository, GitHub sẽ hiển thị hướng dẫn. Chạy các lệnh sau:

```bash
# Thêm remote origin (thay YOUR_USERNAME và REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push code lên GitHub
git branch -M main
git push -u origin main
```

## Bước 5: Cấu hình Repository (tùy chọn)

### 1. Thêm Topics/Tags:
- `nextjs`
- `lightweight-charts`
- `typescript`
- `react`
- `charting`
- `demo`

### 2. Thêm Description chi tiết:
```
🚀 Demo Next.js 14 với Lightweight Charts

✨ Tính năng:
- Candlestick Chart
- HLC Area Chart (Custom Series)
- Responsive Design
- TypeScript Support
- Tailwind CSS

🛠️ Tech Stack:
- Next.js 14
- Lightweight Charts
- TypeScript
- Tailwind CSS
```

### 3. Cấu hình GitHub Pages (nếu muốn deploy):
1. Vào **Settings** > **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**
4. Folder: **/(root)**
5. Click **Save**

## Bước 6: Thêm Badges (tùy chọn)

Thêm vào README.md:

```markdown
![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![Lightweight Charts](https://img.shields.io/badge/Lightweight%20Charts-4.2.0-green)
```

## Bước 7: Deploy (tùy chọn)

### Vercel (Khuyến nghị):
1. Truy cập [vercel.com](https://vercel.com)
2. Import repository từ GitHub
3. Deploy tự động

### Netlify:
1. Truy cập [netlify.com](https://netlify.com)
2. Import từ Git
3. Build command: `npm run build`
4. Publish directory: `.next`

## Lưu ý quan trọng:

1. **Không commit node_modules**: Đã có trong .gitignore
2. **Environment variables**: Tạo file .env.local nếu cần
3. **Secrets**: Không commit API keys vào code
4. **Branch protection**: Có thể setup để bảo vệ main branch

## Cấu trúc Repository sau khi push:

```
lwc-next-demo/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── components/
│       ├── Chart.tsx
│       └── CustomChart.tsx
├── package.json
├── README.md
├── .gitignore
└── ... (các file config khác)
```

## Tiếp theo:

1. **Clone repository** về máy khác để test
2. **Thêm collaborators** nếu làm việc nhóm
3. **Tạo Issues** để track bugs/features
4. **Tạo Pull Requests** cho các thay đổi lớn 