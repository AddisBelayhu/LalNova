# Admin Dashboard - Quick Fix for "Invalid or expired token"

## The Problem

Admin dashboard shows "Invalid or expired token" error on production domain (lalnova.com).

## The Cause

Admin dashboard is trying to connect to `http://localhost:5000` instead of `https://lalnova.com/api`.

## The Fix (3 Steps)

### Step 1: Rebuild Admin Dashboard

Run this command from project root:

**Windows:**
```bash
rebuild-admin.bat
```

**Linux/Mac:**
```bash
chmod +x rebuild-admin.sh
./rebuild-admin.sh
```

**Or manually:**
```bash
cd admin
npm run build
```

### Step 2: Upload to Server

Upload the contents of `admin/dist/` folder to your server:
- cPanel: Upload to `public_html/admin/` (or wherever admin is hosted)
- FTP: Upload to admin directory

### Step 3: Clear Browser Cache & Test

1. Clear browser cache (Ctrl+Shift+Delete)
2. Go to: `https://lalnova.com/secret-admin-access`
3. Enter code: `LALNOVA2024ADMIN`
4. Login:
   - Email: `vibrantteam@lalnova.com`
   - Password: `novatech@2025`

## Verify It's Fixed

Open browser DevTools (F12) → Network tab:
- Login requests should go to `https://lalnova.com/api/auth/login`
- NOT to `http://localhost:5000`

## Still Not Working?

1. Check backend is running: `https://lalnova.com/api/health`
2. Check for CORS errors in browser console
3. See `ADMIN_TROUBLESHOOTING.md` for detailed help

## Configuration Files

These files are already configured correctly:

- `admin/.env.production` → `VITE_API_URL=https://lalnova.com/api`
- `.env.production` → `CORS_ORIGIN=https://lalnova.com`

You just need to rebuild and redeploy!
