@echo off
REM Production Deployment Script for LalNova Technologies (Windows)

echo 🚀 Starting production deployment...

REM Set production environment
set NODE_ENV=production

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install-all

REM Build the React app
echo 🏗️  Building React application...
call npm run build

REM Run database migrations
echo 🗄️  Running database migrations...
call npm run migrate:prod

REM Seed the database
echo 🌱 Seeding database...
call npm run seed

echo ✅ Deployment preparation complete!
echo.
echo 📋 Next steps:
echo 1. Update .env.production with your domain and secure secrets
echo 2. Upload files to your server
echo 3. Run 'npm start' on your server
echo 4. Configure your web server (IIS/Nginx) to proxy to your app
echo.
echo 🌐 Your app will be available at: https://yourdomain.com

pause