# KIN241 Dashboard - Document Management & Logic App Integration

A beautiful and modern dashboard built with Next.js to monitor and manage KIN241 Node.js API with Logic App integration.

## ✨ Features

- 🎨 **Beautiful Interface**: Modern design with Tailwind CSS and Framer Motion
- 📊 **Overview Dashboard**: Display system status, uptime, memory usage
- 🔍 **Health Checks**: Check API endpoints health with detailed monitoring
- 📄 **Document Management**: Manage documents with upload, download, and processing
- 🔗 **Logic App Integration**: Integrate Logic App for automatic document processing
- 🌐 **Ping & Connectivity**: Test network connectivity and services (Microsoft, GitHub, DNS)
- 📱 **Responsive Design**: Compatible with all devices
- ⚡ **Real-time Updates**: Real-time data updates
- 🎭 **Animations**: Smooth and professional effects
- 🌍 **Multi-language Support**: Vietnamese, English, and Japanese

## 🚀 Installation and Setup

### System Requirements
- Node.js 18+ 
- npm or yarn
- KIN241 Node.js API running

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Environment Variables Configuration

Create `.env.local` file in the root directory:

```bash
# API Backend URL
NEXT_PUBLIC_API_URL=https://app-officialhrpoke-kinyu-japaneast-002.azurewebsites.net

# API Timeout (optional)
NEXT_PUBLIC_API_TIMEOUT=30000

# Debug Mode (optional)
NEXT_PUBLIC_DEBUG_MODE=true

# For local development
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3001](http://localhost:3001) to view the dashboard.

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
kin241-nextjs-app/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── Header.tsx           # Header component
│   ├── EndpointCard.tsx     # Endpoint display card
│   ├── HealthStatus.tsx     # Health check component
│   ├── DocumentManagement.tsx # Document management with Logic App
│   ├── FileUpload.tsx       # File upload component
│   ├── TodoManagement.tsx   # Todo management component
│   ├── InfrastructureDiagram.tsx # Azure infrastructure diagram
│   ├── LogicAppTrigger.tsx  # Logic App integration
│   ├── PingConnectivity.tsx # Network connectivity testing
│   ├── ApiDebugger.tsx      # API debugging tool
│   ├── LoadingSpinner.tsx   # Loading animation
│   └── ApiUrlDisplay.tsx    # API URL display
├── contexts/
│   └── LanguageContext.tsx  # Multi-language context
├── hooks/
│   └── useTranslation.ts   # Translation hook
├── lib/
│   ├── config.ts            # API and environment configuration
│   ├── i18n.ts              # Internationalization setup
│   └── locales/             # Translation files
│       ├── en.json          # English translations
│       ├── vi.json          # Vietnamese translations
│       └── ja.json          # Japanese translations
├── public/
│   └── images/              # Image assets
│       └── diagrams/        # Architecture diagrams
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🎨 Design

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
- **Cards**: Glass morphism effect with hover animations
- **Buttons**: Gradient backgrounds with hover effects
- **Status indicators**: Color-coded with icons
- **Loading states**: Smooth animations

## 🔧 Supported API Endpoints

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
- `GET /api/documents/stats` - Get document statistics
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/:id/download` - Download document
- `POST /api/documents/:id/process` - Process document with Logic App
- `POST /api/documents/bulk/process` - Process multiple documents

### Logic App Integration
- `GET /api/documents/logic-app/status` - Get Logic App status
- `POST /api/documents/logic-app/test` - Test Logic App connection
- `GET /api/documents/logic-app/tables` - Get database tables

### Todo Management
- `GET /api/todos` - List all todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `POST /api/todos/bulk` - Bulk operations

### Ping & Connectivity
- `GET /api/ping` - Ping service status
- `GET /api/ping/all` - Test all connectivity
- `GET /api/ping/microsoft` - Test Microsoft connectivity
- `GET /api/ping/github` - Test GitHub connectivity
- `GET /api/ping/internet` - Test internet connectivity
- `GET /api/ping/dns` - Test DNS resolution
- `GET /api/ping/connectivity` - Comprehensive connectivity test

## 🌟 Key Features

### 1. Real-time Monitoring
- Automatic system status updates
- Display uptime, memory usage, Node.js version
- Health checks with visual indicators

### 2. Document Management
- Upload and manage documents
- Display document statistics
- Logic App integration for automatic processing
- Bulk processing for multiple documents
- Real-time status tracking

### 3. Logic App Integration
- Integrate Logic App for automatic document processing
- Test Logic App connection
- Monitor Logic App status
- Bulk processing with Logic App
- Real-time processing updates

### 4. Todo Management
- Create, update, and delete todos
- Priority and category management
- Bulk operations
- Statistics and filtering
- Real-time updates

### 5. Infrastructure Visualization
- Azure architecture diagram
- Multi-language diagram support
- Interactive zoom functionality
- Component highlighting

### 6. Ping & Connectivity Testing
- Test Microsoft, GitHub, Internet connectivity
- DNS resolution testing
- Comprehensive connectivity reports
- Network diagnostics
- Response time monitoring

### 7. Multi-language Support
- Vietnamese (vi)
- English (en)
- Japanese (ja)
- Dynamic language switching
- Localized content

### 8. Interactive Dashboard
- Click to test endpoints
- Toast notifications for feedback
- Loading states with animations
- Error handling with detailed messages

### 9. Environment Configuration
- Use environment variables for API URL
- Fallback to Azure App Service URL
- Display current API URL on dashboard
- Easy configuration for production

### 10. Responsive Design
- Mobile-first approach
- Grid layouts for desktop
- Touch-friendly on mobile
- Optimized for presentations

## 🎯 Perfect for Presentations

This dashboard is specifically designed for presentations with:

- **Visual Appeal**: Beautiful, professional interface
- **Clear Information**: Well-organized information
- **Interactive Elements**: Live demonstrations possible
- **Real-time Data**: Display real data from API
- **Error Handling**: Graceful error handling
- **Logic App Integration**: Demo Logic App integration for document processing
- **Document Management**: Manage documents with upload, download, and processing
- **Connectivity Testing**: Demo network connectivity and ping services
- **Multi-language**: Support for multiple languages

## 🔮 Future Enhancements

- [ ] Dark mode support
- [ ] Historical data charts
- [ ] Alert notifications
- [ ] Export reports
- [ ] Multi-environment support
- [ ] Performance metrics
- [ ] User authentication
- [ ] Role-based access control

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Type check
npm run type-check
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Required |
| `NEXT_PUBLIC_API_TIMEOUT` | API timeout in ms | 30000 |
| `NEXT_PUBLIC_DEBUG_MODE` | Enable debug mode | false |

## 📝 License

MIT License - Free to use for presentation and learning purposes.

---

**Created by**: KIN241 Team  
**Framework**: Next.js 14 + TypeScript  
**Styling**: Tailwind CSS + Framer Motion  
**Icons**: Lucide React  
**Internationalization**: Custom i18n solution