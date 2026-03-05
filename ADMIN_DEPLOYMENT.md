# Admin Dashboard Deployment Guide

## Issue: "Invalid or expired token" Error

This error occurs when the admin dashboard is trying to connect to the wrong API endpoint (localhost instead of production).

## Solution

### Step 1: Verify Production API URL

The admin dashboard is configured to connect to: `https://lalnova.com/api`

Make sure your backend server is:
- Running on lalnova.com
- Accessible at the `/api` path
- Properly configured with CORS to allow requests from the admin dashboard

### Step 2: Rebuild Admin Dashboard for Production

Run these commands from the project root:

```bash
cd admin
npm run build
```

This will create a production build in `admin/dist/` using the settings from `admin/.env.production`.

### Step 3: Deploy Admin Build to Server

You have two deployment options:

#### Option A: Serve Admin from Main Domain (Current Setup)

If you want to access admin at `https://lalnova.com/admin`:

1. Copy the contents of `admin/dist/` to your server
2. Configure your web server to serve the admin files at the `/admin` path
3. Make sure the admin routes are properly configured

#### Option B: Serve Admin from Subdomain (Recommended)

If you want to access admin at `https://admin.lalnova.com`:

1. Create a subdomain `admin.lalnova.com` in your hosting control panel
2. Point it to a separate directory (e.g., `public_html/admin`)
3. Upload the contents of `admin/dist/` to that directory
4. Update CORS settings on the backend (see Step 4)

### Step 4: Update Backend CORS Configuration

If using a subdomain for admin, update your server's `.env` file:

```env
CORS_ORIGIN=https://lalnova.com,https://admin.lalnova.com
```

If serving from the same domain, the current CORS configuration should work.

### Step 5: Test the Deployment

1. Clear your browser cache and cookies
2. Navigate to your admin login page:
   - Main domain: `https://lalnova.com/secret-admin-access`
   - Subdomain: `https://admin.lalnova.com/login`
3. Log in with credentials:
   - Email: vibrantteam@lalnova.com
   - Password: novatech@2025

### Step 6: Verify API Connection

After logging in, open browser DevTools (F12) and check the Network tab:
- Look for requests to `/api/auth/login`
- Verify they're going to `https://lalnova.com/api` (not localhost)
- Check for any CORS errors in the Console tab

## Common Issues

### Issue: Still seeing localhost in API calls

**Solution**: Make sure you rebuilt the admin dashboard after updating `.env.production`

```bash
cd admin
rm -rf dist node_modules/.vite
npm run build
```

### Issue: CORS errors

**Solution**: Update server CORS configuration to include your admin domain

In `server/.env` or `server/.env.production`:
```env
CORS_ORIGIN=https://lalnova.com,https://admin.lalnova.com
```

### Issue: 404 errors on admin routes

**Solution**: Configure your web server to handle client-side routing

For Apache (`.htaccess` in admin directory):
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

For Nginx:
```nginx
location /admin {
    alias /path/to/admin/dist;
    try_files $uri $uri/ /admin/index.html;
}
```

## Quick Deployment Checklist

- [ ] Updated `admin/.env.production` with correct API URL
- [ ] Rebuilt admin dashboard: `cd admin && npm run build`
- [ ] Uploaded `admin/dist/` contents to server
- [ ] Configured web server routing for admin
- [ ] Updated backend CORS settings (if needed)
- [ ] Cleared browser cache
- [ ] Tested login with admin credentials
- [ ] Verified API calls in browser DevTools

## Current Configuration

- **Admin API URL**: `https://lalnova.com/api`
- **Admin Credentials**: vibrantteam@lalnova.com / novatech@2025
- **Secret Access Code**: LALNOVA2024ADMIN
- **Access URLs**:
  - Secret access: `https://lalnova.com/secret-admin-access`
  - Direct login: `https://lalnova.com/admin/login`

## Need Help?

If you continue to experience issues:

1. Check browser console for error messages
2. Verify backend server is running and accessible
3. Test API health endpoint: `https://lalnova.com/api/health`
4. Check server logs for authentication errors
5. Ensure JWT_SECRET is set in server environment variables
