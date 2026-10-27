@echo off
echo ========================================================
echo   Push MAI Corporation Website to Your GitHub Account
echo ========================================================
echo.
cd /d "%~dp0"

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/mai-corporation.git): "

if "%REPO_URL%"=="" (
    echo Error: No URL entered. Exiting.
    pause
    exit /b 1
)

echo.
echo Removing existing remote origin (if any)...
git remote remove origin 2>nul

echo Adding remote origin: %REPO_URL%
git remote add origin %REPO_URL%

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================================
echo   Push completed successfully!
echo ========================================================
pause
