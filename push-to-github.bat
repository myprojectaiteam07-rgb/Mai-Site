@echo off
echo ========================================================
echo   Push MAI Corporation Website to Your GitHub Account
echo ========================================================
echo.
cd /d "%~dp0"

set "GIT_CMD=git"
where git >nul 2>&1
if errorlevel 1 (
    if exist "%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe" (
        set "GIT_CMD=%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe"
    )
)

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/mai-corporation.git): "

if "%REPO_URL%"=="" (
    echo Error: No URL entered. Exiting.
    pause
    exit /b 1
)

echo.
echo Removing existing remote origin (if any)...
"%GIT_CMD%" remote remove origin 2>nul

echo Adding remote origin: %REPO_URL%
"%GIT_CMD%" remote add origin %REPO_URL%

echo.
echo Setting main branch...
"%GIT_CMD%" branch -M main

echo.
echo Pushing to GitHub...
"%GIT_CMD%" push -u origin main

echo.
echo ========================================================
echo   Push completed successfully!
echo ========================================================
pause
