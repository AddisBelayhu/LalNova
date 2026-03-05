@echo off
echo ========================================
echo Rebuilding Admin Dashboard for Production
echo ========================================
echo.

cd admin

echo Cleaning previous build...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite

echo.
echo Building admin dashboard...
call npm run build

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Upload the contents of admin/dist/ to your server
echo 2. Make sure your backend is running at https://lalnova.com/api
echo 3. Clear browser cache and test login
echo.
echo Admin credentials:
echo   Email: vibrantteam@lalnova.com
echo   Password: novatech@2025
echo.
pause
