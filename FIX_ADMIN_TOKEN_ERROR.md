# 🔧 Fix "Invalid or expired token" Error - Action Required

## What's the Problem?

Your admin dashboard on **lalnova.com** is showing "Invalid or expired token" because it's trying to connect to `http://localhost:5000` instead of your production API at `https://lalnova.com/api`.

## Why Did This Happen?

The admin dashboard was built using development settings. It needs to be rebuilt with production settings to connect to the correct API endpoint.

## What I've Done

✅ **Updated configuration files:**
- `admin/.env.production` → Set API URL to `https://lalnova.com/api`
- `.env.production` → Set CORS origin to `https://lalnova.com`

✅ **Created helper scripts:**
- `rebuild-admin.bat` (Windows)
- `rebuild-admin.sh` (Linux/Mac)

✅ **Created documentation:**
- `ADMIN_QUICK_FIX.md` → Quick 3-step solution
- `ADMIN_DEPLOYMENT.md` → Complete deployment guide
- `ADMIN_TROUBLESHOOTING.md` → Detailed troubleshooting
- Updated `ADMIN_ACCESS.md` → Added troubleshooting section

## What You Need to Do

### Option 1: Use the Helper Script (Easiest)

**On Windows:**
```bash
rebuild-admin.bat
```

**On Linux/Mac:**
```bash
chmod +x rebuild-admin.sh
./rebuild-admin.sh
```

This will:
1. Clean old build files
2. Build admin dashboard with production settings
3. Show you next steps

### Option 2: Manual Steps

```bash
# Step 1: Navigate to admin folder
cd admin

# Step 2: Clean old build
rm -rf dist node_modules/.vite

# Step 3: Build for production
npm run build
```

### After Building

1. **Upload to Server:**
   - Upload the contents of `admin/dist/` folder to your server
   - If using cPanel: Upload to wherever your admin is hosted (e.g., `public_html/admin/`)
   - If using FTP: Upload to the admin directory

2. **Clear Browser Cache:**
   - Press Ctrl+Shift+Delete
   - Select "Cached images and files"
   - Click "Clear data"

3. **Test Login:**
   - Go to: `https://lalnova.com/secret-admin-access`
   - Enter code: `LALNOVA2024ADMIN`
   - Login with:
     - Email: `vibrantteam@lalnova.com`
     - Password: `novatech@2025`

## How to Verify It's Fixed

1. Open browser DevTools (press F12)
2. Go to the Network tab
3. Try to login
4. Look for the login request
5. Verify it's going to `https://lalnova.com/api/auth/login` (NOT localhost)

## If It Still Doesn't Work

### Check 1: Backend is Running

Open in browser: `https://lalnova.com/api/health`

Should show:
```json
{
  "status": "ok",
  "timestamp": "...",
  "environment": "production"
}
```

If this fails, your backend server is not running or not accessible.

### Check 2: CORS Errors

Look in browser console (F12) for errors like:
- "Access to XMLHttpRequest blocked by CORS policy"
- "No 'Access-Control-Allow-Origin' header"

If you see these, your backend CORS settings need updating.

### Check 3: Still Using Localhost

If API calls still go to localhost:
1. Make sure you rebuilt AFTER updating `.env.production`
2. Delete `admin/dist` completely
3. Rebuild again
4. Clear browser cache completely

## Need More Help?

See these detailed guides:
- `ADMIN_QUICK_FIX.md` - Quick reference
- `ADMIN_TROUBLESHOOTING.md` - Common issues and solutions
- `ADMIN_DEPLOYMENT.md` - Full deployment instructions

## Summary

**The fix is simple:**
1. Rebuild admin dashboard (it's already configured correctly)
2. Upload new build to server
3. Clear browser cache
4. Login again

The configuration is already correct - you just need to rebuild and redeploy!

---

**Current Settings:**
- Domain: lalnova.com
- API URL: https://lalnova.com/api
- Admin Email: vibrantteam@lalnova.com
- Admin Password: novatech@2025
- Access Code: LALNOVA2024ADMIN
