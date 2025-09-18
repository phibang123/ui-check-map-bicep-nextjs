# KIN241 Dashboard - Document Management & Logic App Integration

Một dashboard đẹp mắt và hiện đại được xây dựng với Next.js để giám sát và quản lý KIN241 Node.js API với Logic App integration.

## ✨ Tính năng

- 🎨 **Giao diện đẹp mắt**: Thiết kế hiện đại với Tailwind CSS và Framer Motion
- 📊 **Dashboard tổng quan**: Hiển thị trạng thái hệ thống, uptime, memory usage
- 🔍 **Health Checks**: Kiểm tra sức khỏe của API endpoints với detailed monitoring
- 📄 **Document Management**: Quản lý documents với upload, download, và processing
- 🔗 **Logic App Integration**: Tích hợp Logic App để xử lý documents tự động
- 🌐 **Ping & Connectivity**: Test kết nối mạng và các dịch vụ (Microsoft, GitHub, DNS)
- 📱 **Responsive Design**: Tương thích với mọi thiết bị
- ⚡ **Real-time Updates**: Cập nhật dữ liệu theo thời gian thực
- 🎭 **Animations**: Hiệu ứng mượt mà và chuyên nghiệp

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn
- KIN241 Node.js API đang chạy

### Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục gốc:

```bash
# API Backend URL
NEXT_PUBLIC_API_URL=https://app-officialhrpoke-kinyu-japaneast-002.azurewebsites.net

# Hoặc cho local development
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Chạy development server

```bash
npm run dev
# hoặc
yarn dev
```

Mở [http://localhost:3001](http://localhost:3001) để xem dashboard.

### Build cho production

```bash
npm run build
npm start
```

## 🏗️ Cấu trúc dự án

```
kin241-nextjs-app/
├── app/
│   ├── globals.css          # Global styles với Tailwind
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Trang chính dashboard
├── components/
│   ├── Header.tsx           # Header component
│   ├── EndpointCard.tsx     # Card hiển thị endpoint
│   ├── HealthStatus.tsx     # Component health check
│   ├── DocumentManagement.tsx # Quản lý documents với Logic App
│   ├── PingConnectivity.tsx # Test kết nối mạng
│   ├── LoadingSpinner.tsx   # Loading animation
│   └── ApiUrlDisplay.tsx    # Hiển thị API URL
├── lib/
│   └── config.ts            # Cấu hình API và environment
├── tailwind.config.js       # Cấu hình Tailwind
├── tsconfig.json           # Cấu hình TypeScript
└── package.json            # Dependencies
```

## 🎨 Thiết kế

### Color Palette
- **Primary**: Blue gradient (#3b82f6 to #0ea5e9)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Warning**: Yellow (#F59E0B)
- **Info**: Blue (#3B82F6)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, gradient text
- **Body**: Clean, readable

### Components
- **Cards**: Glass morphism effect với hover animations
- **Buttons**: Gradient backgrounds với hover effects
- **Status indicators**: Color-coded với icons
- **Loading states**: Smooth animations

## 🔧 API Endpoints được hỗ trợ

### Health & Status
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health check
- `GET /health/readiness` - Readiness probe
- `GET /health/liveness` - Liveness probe
- `GET /health/connectivity` - Connectivity health
- `GET /health/network` - Network health

### Document Management
- `GET /api/documents` - List all documents
- `POST /api/documents/upload` - Upload single document
- `POST /api/documents/upload/multiple` - Upload multiple documents
- `GET /api/documents/stats` - Get document statistics
- `POST /api/documents/:id/process` - Process document with Logic App
- `POST /api/documents/bulk/process` - Process multiple documents

### Logic App Integration
- `GET /api/documents/logic-app/status` - Get Logic App status
- `POST /api/documents/logic-app/test` - Test Logic App connection

### Ping & Connectivity
- `GET /api/ping` - Ping service status
- `GET /api/ping/all` - Test all connectivity
- `GET /api/ping/microsoft` - Test Microsoft connectivity
- `GET /api/ping/github` - Test GitHub connectivity
- `GET /api/ping/internet` - Test internet connectivity
- `GET /api/ping/dns` - Test DNS resolution
- `GET /api/ping/connectivity` - Comprehensive connectivity test

## 🌟 Tính năng nổi bật

### 1. Real-time Monitoring
- Tự động cập nhật trạng thái hệ thống
- Hiển thị uptime, memory usage, Node.js version
- Health checks với visual indicators

### 2. Document Management
- Upload và quản lý documents
- Hiển thị thống kê documents
- Tích hợp Logic App để xử lý tự động
- Bulk processing cho nhiều documents
- Real-time status tracking

### 3. Logic App Integration
- Tích hợp Logic App để xử lý documents tự động
- Test Logic App connection
- Monitor Logic App status
- Bulk processing với Logic App
- Real-time processing updates

### 4. Ping & Connectivity Testing
- Test kết nối Microsoft, GitHub, Internet
- DNS resolution testing
- Comprehensive connectivity reports
- Network diagnostics
- Response time monitoring

### 5. Interactive Dashboard
- Click để test endpoints
- Toast notifications cho feedback
- Loading states với animations
- Error handling với detailed messages

### 6. Environment Configuration
- Sử dụng biến môi trường cho API URL
- Fallback về Azure App Service URL
- Hiển thị API URL hiện tại trên dashboard
- Dễ dàng thay đổi cho production

### 7. Responsive Design
- Mobile-first approach
- Grid layouts cho desktop
- Touch-friendly trên mobile
- Optimized cho presentation

## 🎯 Sử dụng cho thuyết trình

Dashboard này được thiết kế đặc biệt cho việc thuyết trình với:

- **Visual Appeal**: Giao diện đẹp mắt, chuyên nghiệp
- **Clear Information**: Thông tin được tổ chức rõ ràng
- **Interactive Elements**: Có thể demo trực tiếp
- **Real-time Data**: Hiển thị dữ liệu thực từ API
- **Error Handling**: Xử lý lỗi một cách graceful
- **Logic App Integration**: Demo Logic App integration cho document processing
- **Document Management**: Quản lý documents với upload, download, và processing
- **Connectivity Testing**: Demo network connectivity và ping services

## 🔮 Tương lai

- [ ] Dark mode support
- [ ] Historical data charts
- [ ] Alert notifications
- [ ] Export reports
- [ ] Multi-environment support
- [ ] Performance metrics

## 📝 License

MIT License - Sử dụng tự do cho mục đích thuyết trình và học tập.

---

**Tạo bởi**: KIN241 Team  
**Framework**: Next.js 14 + TypeScript  
**Styling**: Tailwind CSS + Framer Motion  
**Icons**: Lucide React
