@echo off
echo ========================================================
echo   Pushing MAI Corporation Website to GitHub
echo   Repository: https://github.com/myprojectaiteam07-rgb/Mai-Site.git
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

echo Configuring remote...
"%GIT_CMD%" remote remove origin 2>nul
"%GIT_CMD%" remote add origin https://github.com/myprojectaiteam07-rgb/Mai-Site.git
"%GIT_CMD%" branch -M main

echo.
echo Pushing to GitHub (Sign in with your GitHub account if prompted)...
"%GIT_CMD%" push -u origin main

echo.
echo ========================================================
if errorlevel 1 (
    echo   Push encountered an error. If prompted, please verify
    echo   your GitHub permissions / Personal Access Token.
) else (
    echo   Pushed successfully to https://github.com/myprojectaiteam07-rgb/Mai-Site.git!
)
echo ========================================================
pause
