# Admin Dashboard Troubleshooting Guide

## Error: "Invalid or expired token"

This error occurs when the admin dashboard cannot communicate with the backend API properly.

### Root Cause

The admin dashboard build is using the wrong API endpoint (localhost instead of production).

### Solution

Follow these steps in order:

#### 1. Verify Environment Configuration

Check `admin/.env.production`:
```env
VITE_API_URL=https://lalnova.com/api
```

#### 2. Rebuild Admin Dashboard

Run the rebuild script:

**Windows:**
```bash
rebuild-admin.bat
```

**Linux/Mac:**
```bash
chmod +x rebuild-admin.sh
./rebuild-admin.sh
```

Or manually:
```bash
cd admin
rm -rf dist node_modules/.vite
npm run build
```

#### 3. Deploy New Build

Upload the contents of `admin/dist/` to your server:

- If using cPanel: Upload to `public_html/admin/` or wherever your admin is hosted
- If using FTP: Upload to the admin directory on your server

#### 4. Clear Browser Cache

Important! Old cached files can cause issues:

1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use Ctrl+Shift+Delete to clear all cache

#### 5. Test Login

1. Navigate to: `https://lalnova.com/secret-admin-access`
2. Enter access code: `LALNOVA2024ADMIN`
3. Login with:
   - Email: `vibrantteam@lalnova.com`
   - Password: `novatech@2025`

### Verification Steps

#### Check API Endpoint in Browser

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for the login request
5. Verify it's going to `https://lalnova.com/api/auth/login` (NOT localhost)

#### Check for CORS Errors

1. Open browser Console tab (F12)
2. Look for errors like:
   - "Access to XMLHttpRequest blocked by CORS policy"
   - "No 'Access-Control-Allow-Origin' header"

If you see CORS errors, update server configuration (see below).

#### Test Backend API

Open in browser: `https://lalnova.com/api/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-03-03T...",
  "environment": "production"
}
```

If this fails, your backend server is not running or not accessible.

## Common Issues and Solutions

### Issue 1: API calls still going to localhost

**Symptoms:**
- Network tab shows requests to `http://localhost:5000`
- Console shows "Failed to fetch" or connection refused errors

**Solution:**
1. Verify `admin/.env.production` has correct URL
2. Delete `admin/dist` folder completely
3. Rebuild: `cd admin && npm run build`
4. Re-upload to server
5. Clear browser cache (Ctrl+Shift+Delete)

### Issue 2: CORS errors

**Symptoms:**
- Console shows "blocked by CORS policy"
- Network tab shows failed requests with CORS error

**Solution:**

Update `.env.production` in project root:
```env
CORS_ORIGIN=https://lalnova.com
```

If admin is on subdomain:
```env
CORS_ORIGIN=https://lalnova.com,https://admin.lalnova.com
```

Restart backend server after changing CORS settings.

### Issue 3: 404 errors on admin routes

**Symptoms:**
- Login page loads but other pages show 404
- Refreshing admin dashboard shows 404

**Solution:**

Add `.htaccess` file in admin directory:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /admin/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /admin/index.html [L]
</IfModule>
```

### Issue 4: Token expires immediately

**Symptoms:**
- Can login but immediately logged out
- Token validation fails

**Solution:**

1. Check server `JWT_SECRET` is set in `.env.production`
2. Verify server time is correct (JWT uses timestamps)
3. Check browser cookies are enabled
4. Verify localStorage is not blocked

### Issue 5: Backend not responding

**Symptoms:**
- API health check fails
- All API requests timeout

**Solution:**

1. Check if backend server is running
2. Verify port 5000 is accessible
3. Check server logs for errors
4. Verify database connection is working
5. Check firewall settings

## Server Configuration

### Backend Server Requirements

Your backend must be:
- Running on the production server
- Accessible at `https://lalnova.com/api`
- Configured with correct CORS origins
- Using production environment variables

### Environment Variables Checklist

`.env.production` (project root):
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` set correctly
- [ ] `JWT_SECRET` set to strong secret
- [ ] `ADMIN_EMAIL=vibrantteam@lalnova.com`
- [ ] `ADMIN_PASSWORD=novatech@2025`
- [ ] `CORS_ORIGIN=https://lalnova.com`

`admin/.env.production`:
- [ ] `VITE_API_URL=https://lalnova.com/api`

### Web Server Configuration

#### Apache (.htaccess)

Main site `.htaccess`:
```apache
# API requests go to backend
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]

# Admin routes
RewriteCond %{REQUEST_URI} ^/admin
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^admin/(.*)$ /admin/index.html [L]

# Client routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

#### Nginx

```nginx
# API proxy
location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

# Admin dashboard
location /admin {
    alias /path/to/admin/dist;
    try_files $uri $uri/ /admin/index.html;
}

# Client app
location / {
    root /path/to/client/build;
    try_files $uri $uri/ /index.html;
}
```

## Testing Checklist

After deployment, verify:

- [ ] Backend health check works: `https://lalnova.com/api/health`
- [ ] Admin login page loads: `https://lalnova.com/secret-admin-access`
- [ ] Can enter access code: `LALNOVA2024ADMIN`
- [ ] Can login with credentials
- [ ] Dashboard loads after login
- [ ] Can view services list
- [ ] Can view projects list
- [ ] Can view messages list
- [ ] No console errors in browser DevTools
- [ ] API calls go to production URL (not localhost)
- [ ] No CORS errors in console

## Getting More Help

If issues persist:

1. **Check Browser Console**: Look for specific error messages
2. **Check Network Tab**: See which requests are failing
3. **Check Server Logs**: Look for backend errors
4. **Test API Directly**: Use Postman or curl to test endpoints
5. **Verify Database**: Ensure database is accessible and seeded

### Useful Commands

Test API health:
```bash
curl https://lalnova.com/api/health
```

Test login endpoint:
```bash
curl -X POST https://lalnova.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vibrantteam@lalnova.com","password":"novatech@2025"}'
```

Check server logs (if using PM2):
```bash
pm2 logs lalnova-backend
```

## Quick Fix Summary

Most common fix for "Invalid or expired token":

```bash
# 1. Rebuild admin
cd admin
npm run build

# 2. Upload admin/dist/ to server

# 3. Clear browser cache (Ctrl+Shift+Delete)

# 4. Test login at https://lalnova.com/secret-admin-access
```

## Contact Information

- **Admin Email**: vibrantteam@lalnova.com
- **Admin Password**: novatech@2025
- **Access Code**: LALNOVA2024ADMIN
- **Domain**: https://lalnova.com
