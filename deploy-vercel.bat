@echo off
echo ========================================================
echo   Deploying MAI Corporation Website to Vercel
echo ========================================================
echo.
cd /d "%~dp0"

echo Step 1: Logging into Vercel (Choose GitHub, Email, etc.)...
call npx vercel login

echo.
echo Step 2: Deploying to Production on Vercel...
call npx vercel --prod

echo.
echo ========================================================
echo   Deployment Process Completed!
echo ========================================================
pause
