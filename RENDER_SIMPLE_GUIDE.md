# Simple Render Deployment Guide (No Blueprint)

Follow these steps to deploy manually - it's easier and more reliable!

---

## Step 1: Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Fill in:
   - **Name**: `lalnova-database`
   - **Database**: `lalnova_db`
   - **Region**: Choose any (Oregon recommended)
   - **Plan**: **Free**
4. Click **"Create Database"**
5. Wait for it to be created (1-2 minutes)
6. **COPY the "Internal Database URL"** - you'll need this!
   - It looks like: `postgresql://user:password@host/database`

---

## Step 2: Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Click **"Build and deploy from a Git repository"**
3. Connect your GitHub account and select your repository
4. Fill in:

   **Name**: `lalnova-backend`
   
   **Region**: Same as database (Oregon)
   
   **Branch**: `main`
   
   **Root Directory**: (leave empty)
   
   **Runtime**: `Node`
   
   **Build Command**:
   ```
   npm install && cd server && npx prisma generate && npx prisma migrate deploy
   ```
   
   **Start Command**:
   ```
   npm start
   ```
   
   **Plan**: **Free**

5. Click **"Advanced"** to add Environment Variables:

   Add these one by one:
   
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `DATABASE_URL` | Paste your Internal Database URL from Step 1 |
   | `JWT_SECRET` | `lalnova-super-secret-jwt-key-2025` |
   | `ADMIN_EMAIL` | `vibrantteam@lalnova.com` |
   | `ADMIN_PASSWORD` | `novatech@2025` |

6. Click **"Create Web Service"**

7. Wait for deployment (5-10 minutes)

8. Once it says "Live", **copy your backend URL**
   - Example: `https://lalnova-backend.onrender.com`

---

## Step 3: Test Backend

Visit: `https://YOUR-BACKEND-URL.onrender.com/api/health`

You should see: `{"status":"ok"}`

If you see this, your backend is working! 🎉

---

## Step 4: Seed Database

1. In your backend service on Render, click the **"Shell"** tab
2. Run these commands:
   ```bash
   cd server
   node prisma/seed.js
   ```

This creates your admin user and initial data.

---

## Step 5: Update Frontend for Production

Now update your Netlify site to use the Render backend:

1. **Update** `client/.env.production`:
   ```env
   REACT_APP_API_URL=https://YOUR-BACKEND-URL.onrender.com
   ```
   Replace with your actual backend URL!

2. **Rebuild** frontend:
   ```bash
   cd client
   npm run build
   ```

3. **Redeploy** to Netlify:
   - Go to https://app.netlify.com/sites/vocal-cocada-3c356a/deploys
   - Drag and drop the `client/build` folder

---

## Step 6: Update Backend CORS

Your backend needs to allow requests from Netlify.

1. Open `server/index.js`
2. Find the CORS configuration
3. Update it to include your Netlify URL:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://vocal-cocada-3c356a.netlify.app']
    : 'http://localhost:3000',
  credentials: true
};
```

4. Commit and push to GitHub:
   ```bash
   git add server/index.js
   git commit -m "Update CORS for Netlify"
   git push
   ```

5. Render will automatically redeploy your backend

---

## Step 7: Test Everything!

Visit your Netlify site: https://vocal-cocada-3c356a.netlify.app

Test:
- ✅ Homepage shows services (from database)
- ✅ Projects page shows projects (from database)
- ✅ Contact form works
- ✅ Admin login at `/secret-admin-access`
- ✅ Admin dashboard works

---

## Troubleshooting

### Backend shows "Service Unavailable"
- Check the Logs tab in Render
- Verify DATABASE_URL is correct
- Make sure all environment variables are set

### Frontend can't connect to backend
- Check browser console for errors
- Verify REACT_APP_API_URL is correct
- Check CORS settings in backend

### Database connection fails
- Use **Internal Database URL**, not External
- Check the URL format is correct

---

## Your Live URLs

After completion:

- **Frontend**: https://vocal-cocada-3c356a.netlify.app
- **Backend**: https://YOUR-BACKEND-URL.onrender.com
- **Admin**: https://vocal-cocada-3c356a.netlify.app/secret-admin-access

---

## Important Notes

⚠️ **Free Tier Limitations:**
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Database is free for 90 days, then $7/month

💡 **Tip:** Use UptimeRobot (free) to ping your backend every 14 minutes to keep it awake!

---

That's it! Your full-stack site is now live! 🚀
