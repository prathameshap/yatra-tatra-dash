# CORS Configuration Testing Guide

## Overview

This guide explains how to test the CORS (Cross-Origin Resource Sharing) configuration that has been added to the DR Monitoring backend to enable local dashboard integration.

## What Was Added

### 1. Backend CORS Configuration
- **Program.cs**: Added CORS services with "AllowAll" policy
- **host.json**: Added CORS configuration for Azure Functions
- **drMonitoringFunctions.cs**: Added CORS headers to all HTTP responses
- **OPTIONS handler**: Added to handle preflight requests

### 2. Frontend Testing Tools
- **test-cors.html**: Simple test page to verify CORS functionality
- **Updated config.js**: Already configured for localhost:7071

## Testing Steps

### Step 1: Start the Backend
```bash
cd yatra-tatra
func start
```

The backend should start on `http://localhost:7071`

### Step 2: Test CORS with the Test Page
1. Open `test-cors.html` in your browser
2. Click "Test Connection" to verify basic connectivity
3. Test individual endpoints
4. Test dashboard integration

### Step 3: Test the Main Dashboard
1. Open `index.html` in your browser
2. Check browser console for any CORS errors
3. Try refreshing the dashboard
4. Test resource loading

## Expected Results

### ✅ Success Indicators
- No CORS errors in browser console
- Dashboard loads data from backend
- All API endpoints respond successfully
- OPTIONS requests return 200 OK

### ❌ Common Issues
- **CORS error**: Backend not running or CORS not configured
- **Connection refused**: Backend not started
- **404 errors**: Endpoints not found (check route configuration)

## Troubleshooting

### CORS Still Not Working?
1. **Check backend is running**: `http://localhost:7071/api/health`
2. **Verify CORS headers**: Check response headers in browser dev tools
3. **Clear browser cache**: Hard refresh (Ctrl+F5)
4. **Check browser console**: Look for CORS error messages

### Backend Won't Start?
1. **Check .NET version**: `dotnet --version` (should be 7.0+)
2. **Check Azure Functions tools**: `func --version` (should be 4.x)
3. **Check dependencies**: `dotnet restore`
4. **Check configuration**: Verify `local.settings.json`

## API Endpoints Available

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/dashboard` | GET | Dashboard data |
| `/api/resources` | GET | All resources |
| `/api/resources/{id}` | GET | Specific resource |
| `/api/scan` | POST | Trigger scan |
| `/api/discrepancies` | GET | Configuration discrepancies |
| `/api/reports/executive` | GET | Executive report |

## Browser Compatibility

- **Chrome/Edge**: Full CORS support
- **Firefox**: Full CORS support  
- **Safari**: Full CORS support
- **IE11**: Limited support (not recommended)

## Security Notes

⚠️ **Important**: The current CORS configuration allows all origins (`*`) for local development only. 

**For production:**
- Restrict `allowedOrigins` to specific domains
- Remove `*` from origins
- Consider authentication/authorization
- Use HTTPS in production

## Next Steps

Once CORS is working:
1. Test all dashboard functionality
2. Verify data loading from backend
3. Test error handling
4. Implement proper security for production
5. Add authentication if required

