# Admin Dashboard Local Debug Guide

## Issue: "Failed to fetch data" on Local Admin

### Step-by-Step Debugging

#### 1. Check Backend is Running

Open terminal and verify:
```bash
cd server
npm start
```

Test health endpoint:
```
http://localhost:5000/api/health
```

Should return: `{"status":"ok",...}`

#### 2. Check Browser Console

1. Open admin dashboard: `http://localhost:3001`
2. Press F12 to open DevTools
3. Go to **Console** tab
4. Look for errors (red text)
5. Go to **Network** tab
6. Try to refresh the dashboard
7. Look for failed requests (red status codes)

**Common errors you might see:**

- `ERR_CONNECTION_REFUSED` → Backend not running
- `401 Unauthorized` → Token expired or invalid
- `CORS error` → CORS configuration issue
- `Network Error` → Wrong API URL

#### 3. Check Authentication Token

Open browser console (F12) and run:

```javascript
// Check if token exists
localStorage.getItem('token')

// Check if user exists
localStorage.getItem('user')

// Check axios baseURL
axios.defaults.baseURL
```

If token is null or undefined, you need to log in again.

#### 4. Clear Storage and Re-login

Sometimes the token gets corrupted. Clear it:

```javascript
// In browser console (F12)
localStorage.clear()
```

Then:
1. Refresh the page
2. Go to login: `http://localhost:3001/login`
3. Login with: `vibrantteam@lalnova.com` / `novatech@2025`

#### 5. Verify Environment Variables

Check if Vite is loading the environment variable:

In browser console (F12):
```javascript
// This won't work directly, but check Network tab
// Look at the request URLs - they should go to http://localhost:5000
```

Or check the admin terminal output when starting:
```bash
cd admin
npm run dev
```

Look for any warnings about environment variables.

#### 6. Restart Admin with Clean Cache

```bash
cd admin

# Stop the server (Ctrl+C)

# Clear Vite cache
rm -rf node_modules/.vite

# Restart
npm run dev
```

#### 7. Check Database

The backend might be running but database is empty:

```bash
cd server

# Check if database exists and has data
npx prisma studio
```

This opens a GUI at `http://localhost:5555` where you can see your data.

If tables are empty:
```bash
npm run seed
```

#### 8. Test API Manually

Test if the admin endpoints work with curl:

```bash
# First, get a token by logging in
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vibrantteam@lalnova.com","password":"novatech@2025"}'

# Copy the token from response, then test admin endpoint
curl http://localhost:5000/api/admin/services \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

If this works, the backend is fine and the issue is in the frontend.

### Common Solutions

#### Solution 1: Token Expired

```javascript
// In browser console
localStorage.clear()
// Then refresh and login again
```

#### Solution 2: Wrong API URL

Check `admin/.env`:
```env
VITE_API_URL=http://localhost:5000
```

Then restart admin:
```bash
cd admin
npm run dev
```

#### Solution 3: CORS Issue

Check `server/index.js` CORS configuration includes localhost:3001:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? productionOrigins
    : [
        process.env.CLIENT_URL || 'http://localhost:3000',
        process.env.ADMIN_URL || 'http://localhost:3001'  // ← Should be here
      ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

#### Solution 4: Database Not Seeded

```bash
cd server
npm run seed
```

#### Solution 5: Complete Reset

If nothing works, do a complete reset:

```bash
# Terminal 1 - Backend
cd server
npx prisma migrate reset  # WARNING: This deletes all data!
npm run seed
npm start

# Terminal 2 - Admin
cd admin
rm -rf node_modules/.vite
npm run dev

# Browser
# Clear localStorage: localStorage.clear()
# Go to: http://localhost:3001/login
# Login with: vibrantteam@lalnova.com / novatech@2025
```

### What to Check in Browser DevTools

#### Console Tab
Look for:
- ❌ `Failed to fetch`
- ❌ `Network Error`
- ❌ `401 Unauthorized`
- ❌ `CORS policy`

#### Network Tab
1. Refresh the dashboard
2. Look for requests to `/api/admin/services`, `/api/admin/projects`, `/api/admin/messages`
3. Check:
   - Request URL (should be `http://localhost:5000/api/admin/...`)
   - Status Code (should be 200, not 401 or 500)
   - Response (should have data, not error)
   - Headers → Authorization (should have `Bearer token...`)

### Quick Checklist

- [ ] Backend running on port 5000
- [ ] Admin running on port 3001
- [ ] `http://localhost:5000/api/health` returns OK
- [ ] `admin/.env` has `VITE_API_URL=http://localhost:5000`
- [ ] Logged in with valid credentials
- [ ] Token exists in localStorage
- [ ] No CORS errors in console
- [ ] Database has been seeded
- [ ] Browser cache cleared

### Still Not Working?

Share these details:

1. **Console errors** (from F12 → Console tab)
2. **Network tab** (screenshot of failed requests)
3. **Backend terminal output** (any errors?)
4. **Admin terminal output** (any warnings?)
5. **localStorage token** (run `localStorage.getItem('token')` in console)

This will help identify the exact issue!
