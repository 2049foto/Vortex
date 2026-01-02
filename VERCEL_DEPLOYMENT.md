# Vercel Deployment Guide

## Cấu hình đã sửa

### 1. Root vercel.json
- Chỉ định `rootDirectory: "packages/frontend"` để Vercel biết build từ đâu

### 2. packages/frontend/vercel.json
- Framework: Vite (auto-detect)
- Install command: `npm install --legacy-peer-deps`
- Build command: `npm run build`
- Output directory: `dist`

### 3. .npmrc files
- Root: `legacy-peer-deps=true`
- Frontend: `legacy-peer-deps=true`

## Cách deploy

### Option 1: Vercel CLI
```bash
cd packages/frontend
vercel --prod
```

### Option 2: GitHub Integration
1. Push code lên GitHub
2. Vercel tự động detect và deploy
3. Đảm bảo root directory là `packages/frontend`

### Option 3: Vercel Dashboard
1. Import project từ GitHub
2. Set root directory: `packages/frontend`
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Install command: `npm install --legacy-peer-deps`

## Environment Variables

Đảm bảo set các biến môi trường trong Vercel:
- `VITE_API_URL` - Backend API URL
- `VITE_TARGET_CHAIN` - Target chain ID
- (Các biến khác nếu cần)

## Troubleshooting

### Lỗi: "Command exited with 1"
- Kiểm tra Node version (>=18)
- Kiểm tra package.json có đúng không
- Xem build logs trong Vercel dashboard

### Lỗi: "Cannot find module"
- Đảm bảo `npm install --legacy-peer-deps` chạy thành công
- Kiểm tra dependencies trong package.json

### Lỗi: "Build failed"
- Kiểm tra TypeScript errors: `npm run type-check`
- Kiểm tra build local: `npm run build`

