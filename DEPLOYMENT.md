# Hướng dẫn Deploy - KIN241 Next.js App

## Vấn đề 404 khi Deploy

### Nguyên nhân chính:
1. **Environment Variables không được set đúng**
2. **CORS issues với external API**
3. **Timeout và network issues**

## Giải pháp

### 1. Cấu hình Environment Variables

Tạo file `.env.local` hoặc set environment variables trong hosting platform:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://frontdoor-Kinyu-japaneast-002-endpoint-hmekaydxcpdwend8.a02.azurefd.net

# Optional settings
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_DEBUG_MODE=true
```

### 2. Các Platform Deploy

#### Vercel
```bash
# Set environment variables trong Vercel dashboard
NEXT_PUBLIC_API_URL=https://frontdoor-Kinyu-japaneast-002-endpoint-hmekaydxcpdwend8.a02.azurefd.net
NEXT_PUBLIC_DEBUG_MODE=true
```

#### Netlify
```bash
# Set trong Netlify dashboard > Site settings > Environment variables
NEXT_PUBLIC_API_URL=https://frontdoor-Kinyu-japaneast-002-endpoint-hmekaydxcpdwend8.a02.azurefd.net
NEXT_PUBLIC_DEBUG_MODE=true
```

#### Azure Static Web Apps
```bash
# Set trong Azure portal > Configuration > Application settings
NEXT_PUBLIC_API_URL=https://frontdoor-Kinyu-japaneast-002-endpoint-hmekaydxcpdwend8.a02.azurefd.net
NEXT_PUBLIC_DEBUG_MODE=true
```

### 3. Debug Steps

1. **Kiểm tra Environment Variables:**
   - Mở browser console
   - Check `NEXT_PUBLIC_API_URL` value
   - Verify API base URL is correct

2. **Test API Connection:**
   - Sử dụng component ApiDebugger
   - Check network tab trong browser dev tools
   - Verify CORS headers

3. **Common Issues:**

   **Issue: 404 Not Found**
   ```bash
   # Check if API URL is correct
   curl https://frontdoor-Kinyu-japaneast-002-endpoint-hmekaydxcpdwend8.a02.azurefd.net/health
   ```

   **Issue: CORS Error**
   ```bash
   # API server needs to allow CORS from your domain
   # Check if API server has proper CORS headers
   ```

   **Issue: Timeout**
   ```bash
   # Increase timeout in environment variables
   NEXT_PUBLIC_API_TIMEOUT=60000
   ```

### 4. Production Checklist

- [ ] Environment variables set correctly
- [ ] API URL accessible from browser
- [ ] CORS configured on API server
- [ ] Debug mode disabled for production
- [ ] Test all API endpoints
- [ ] Check browser console for errors

### 5. Troubleshooting Commands

```bash
# Test API locally
npm run dev

# Test API connection
curl -I https://frontdoor-Kinyu-japaneast-002-endpoint-hmekaydxcpdwend8.a02.azurefd.net/health

# Check environment variables
echo $NEXT_PUBLIC_API_URL

# Build and test
npm run build
npm run start
```

### 6. Monitoring

Sử dụng component ApiDebugger để:
- Monitor API connection status
- Check response times
- Debug configuration issues
- Test different endpoints

## Support

Nếu vẫn gặp vấn đề, check:
1. Browser console errors
2. Network tab requests
3. API server logs
4. Environment variables in hosting platform
