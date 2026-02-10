# Complete Render Deployment Guide

Deploy your full-stack LalNova Technologies website with backend and database on Render.

## Prerequisites

1. **GitHub Account**: https://github.com
2. **Render Account**: https://render.com (sign up with GitHub)
3. **Your code pushed to GitHub**

---

## Step 1: Push Your Code to GitHub

If you haven't already:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment"

# Create a new repository on GitHub, then:
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

---

## Step 2: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `lalnova-database`
   - **Database**: `lalnova_db`
   - **User**: `lalnova_user` (auto-generated)
   - **Region**: Choose closest to you
   - **Plan**: **Free**
4. Click **"Create Database"**
5. **IMPORTANT**: Copy the **Internal Database URL** (starts with `postgresql://`)
   - Save this URL - you'll need it for the backend!

---

## Step 3: Deploy Backend (Node.js API)

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:

   **Basic Settings:**
   - **Name**: `lalnova-backend`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or `.` if needed)
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm install && cd server && npx prisma generate && npx prisma migrate deploy
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```
   - **Plan**: **Free**

4. **Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   
   Add these variables:
   
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<PASTE_YOUR_INTERNAL_DATABASE_URL_HERE>
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ADMIN_EMAIL=vibrantteam@lalnova.com
   ADMIN_PASSWORD=novatech@2025
   ```

   **IMPORTANT**: Replace `<PASTE_YOUR_INTERNAL_DATABASE_URL_HERE>` with the database URL you copied in Step 2!

5. Click **"Create Web Service"**

6. Wait for deployment (5-10 minutes)

7. Once deployed, copy your backend URL (e.g., `https://lalnova-backend.onrender.com`)

---

## Step 4: Update Frontend to Use Render Backend

Now we need to update your frontend to connect to the Render backend instead of localhost.

### Create Production Environment File:

Create `client/.env.production` with:

```env
REACT_APP_API_URL=https://lalnova-backend.onrender.com
```

Replace `https://lalnova-backend.onrender.com` with YOUR actual Render backend URL.

### Update API Calls:

The app should automatically use `REACT_APP_API_URL` for production. If not, update axios base URL in your code.

---

## Step 5: Deploy Frontend to Render (or Keep Netlify)

### Option A: Deploy Frontend to Render

1. Click **"New +"** → **"Static Site"**
2. Connect same GitHub repository
3. Configure:
   - **Name**: `lalnova-frontend`
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `client/build`
   - **Plan**: **Free**

4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://lalnova-backend.onrender.com
   ```

5. Click **"Create Static Site"**

### Option B: Keep Using Netlify (Recommended)

1. Update `client/.env.production`:
   ```env
   REACT_APP_API_URL=https://lalnova-backend.onrender.com
   ```

2. Rebuild your frontend:
   ```bash
   cd client
   npm run build
   ```

3. Redeploy to Netlify (drag and drop the `build` folder)

---

## Step 6: Seed the Database

After backend is deployed, seed your database with initial data:

1. Go to your backend service on Render
2. Click **"Shell"** tab (or use Render's web shell)
3. Run:
   ```bash
   cd server
   node prisma/seed.js
   ```

This will create your admin user and initial data.

---

## Step 7: Update CORS Settings

Make sure your backend allows requests from your frontend domain.

In `server/index.js`, the CORS should already be configured for production. Verify it includes your frontend URL:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://vocal-cocada-3c356a.netlify.app', 'https://lalnova-frontend.onrender.com']
    : 'http://localhost:3000',
  credentials: true
};
```

If you need to update this, push changes to GitHub and Render will auto-deploy.

---

## Step 8: Test Your Deployment

### Test Backend:
Visit: `https://lalnova-backend.onrender.com/api/health`

Should return: `{"status":"ok"}`

### Test Frontend:
Visit your Netlify or Render frontend URL

### Test Full Functionality:
1. ✅ Homepage loads with services
2. ✅ Projects page shows projects
3. ✅ Contact form submits successfully
4. ✅ Admin login works at `/secret-admin-access`
5. ✅ Admin dashboard loads and can manage content

---

## Important Notes

### Free Tier Limitations:

**Render Free Tier:**
- ✅ Backend sleeps after 15 minutes of inactivity
- ✅ First request after sleep takes 30-60 seconds (cold start)
- ✅ 750 hours/month free (enough for one service)
- ✅ PostgreSQL database: 90 days free, then $7/month

**Solutions:**
- Use a service like UptimeRobot to ping your backend every 14 minutes
- Upgrade to paid plan ($7/month) for always-on service

### Database Backups:
- Render free PostgreSQL doesn't include automatic backups
- Export your data regularly or upgrade to paid plan

---

## Troubleshooting

### Backend won't start:
- Check environment variables are set correctly
- Check build logs for errors
- Verify DATABASE_URL is correct

### Frontend can't connect to backend:
- Verify REACT_APP_API_URL is set correctly
- Check CORS settings in backend
- Check browser console for errors

### Database connection fails:
- Use **Internal Database URL** (not External)
- Verify DATABASE_URL format: `postgresql://user:password@host:port/database`

### Prisma migration fails:
- Run migrations manually in Render shell:
  ```bash
  cd server
  npx prisma migrate deploy
  ```

---

## Your Deployment URLs

After completing all steps, you'll have:

- **Frontend (Netlify)**: https://vocal-cocada-3c356a.netlify.app
- **Backend (Render)**: https://lalnova-backend.onrender.com
- **Database (Render)**: Internal PostgreSQL instance
- **Admin Access**: https://vocal-cocada-3c356a.netlify.app/secret-admin-access

---

## Updating Your Site

### Update Frontend:
1. Make changes locally
2. Build: `cd client && npm run build`
3. Drag and drop `build` folder to Netlify

### Update Backend:
1. Make changes locally
2. Commit and push to GitHub
3. Render automatically deploys new version

---

## Cost Summary

- **Netlify Frontend**: FREE forever
- **Render Backend**: FREE (with cold starts)
- **Render PostgreSQL**: FREE for 90 days, then $7/month
- **Total**: FREE for 90 days, then $7/month

---

## Next Steps

1. ✅ Set up custom domain (optional)
2. ✅ Configure email service for contact form
3. ✅ Set up monitoring (UptimeRobot)
4. ✅ Enable analytics (Google Analytics)
5. ✅ Set up regular database backups

---

## Support

If you encounter issues:
- Check Render logs: Dashboard → Your Service → Logs
- Check browser console for frontend errors
- Verify all environment variables are set correctly

---

**Congratulations!** 🎉 Your full-stack website is now live with a working backend and database!
