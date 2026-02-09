# Free Deployment Guide for LalNova Technologies

## Option 1: Vercel (Recommended - Easiest)

### Prerequisites
1. Create a GitHub account (if you don't have one)
2. Create a Vercel account at https://vercel.com (sign up with GitHub)

### Steps to Deploy:

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration
   - Click "Deploy"

3. **Set Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add these variables:
     ```
     DATABASE_URL=file:./dev.db
     JWT_SECRET=your-secret-key-here
     ADMIN_EMAIL=vibrantteam@lalnova.com
     ADMIN_PASSWORD=novatech@2025
     NODE_ENV=production
     ```

4. **Your site will be live at:** `https://your-project-name.vercel.app`

---

## Option 2: Netlify (Frontend Only)

### For Frontend Deployment:

1. **Build the client:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to https://app.netlify.com
   - Drag and drop the `client/build` folder
   - Your site will be live instantly!

**Note:** For backend, you'll need to deploy separately on Render or Railway.

---

## Option 3: Render (Full-Stack)

### Prerequisites
1. Create account at https://render.com

### Steps:

1. **Push code to GitHub** (same as Vercel step 1)

2. **Deploy Backend:**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Settings:
     - Name: lalnova-backend
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Add environment variables (same as Vercel)

3. **Deploy Frontend:**
   - Click "New +" → "Static Site"
   - Connect same GitHub repo
   - Settings:
     - Name: lalnova-frontend
     - Build Command: `cd client && npm install && npm run build`
     - Publish Directory: `client/build`

4. **Update API URL:**
   - In `client/src` files, update API calls to use your Render backend URL

---

## Option 4: Railway (Full-Stack)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect and deploy both frontend and backend
6. Add environment variables in Railway dashboard

---

## Quick Deploy Commands

### If you want to test locally first:
```bash
# Build everything
npm run build:full

# Start production server
npm start
```

### Access your local production build:
- Frontend: http://localhost:5000 (served by Express)
- Backend API: http://localhost:5000/api

---

## Recommended: Vercel

**Why Vercel?**
- ✅ Easiest setup
- ✅ Automatic HTTPS
- ✅ Fast global CDN
- ✅ Free custom domain support
- ✅ Automatic deployments on git push
- ✅ Great for React apps

**Free Tier Includes:**
- Unlimited deployments
- 100GB bandwidth/month
- Automatic SSL certificates
- Custom domains

---

## After Deployment

1. **Test all features:**
   - Homepage and navigation
   - Contact form
   - Admin login at `/secret-admin-access`
   - Admin dashboard functionality
   - Chatbot
   - Social media links

2. **Update social media links** with real URLs in:
   - `client/src/components/SocialMediaLinks.js`
   - `client/src/components/Footer.js`

3. **Custom Domain (Optional):**
   - Buy domain from Namecheap, GoDaddy, etc.
   - Add to Vercel/Netlify/Render settings
   - Update DNS records

---

## Need Help?

If you encounter issues:
1. Check deployment logs in your hosting dashboard
2. Verify all environment variables are set
3. Ensure database is properly configured
4. Check that all dependencies are installed

---

## Security Notes

⚠️ **Before going live:**
1. Change JWT_SECRET to a strong random string
2. Update admin credentials
3. Set up proper database (not SQLite for production)
4. Enable CORS only for your domain
5. Review and update IP whitelist if needed
