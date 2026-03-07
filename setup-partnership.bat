@echo off
echo ========================================
echo Setting Up Partnership Database
echo ========================================
echo.

cd server

echo Step 1: Creating database table...
npx prisma db push

echo.
echo Step 2: Generating Prisma Client...
npx prisma generate

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your backend server (Ctrl+C then npm start)
echo 2. Refresh your admin dashboard
echo 3. Test the partnership form
echo.
echo The partnership form should now work!
echo.
pause
