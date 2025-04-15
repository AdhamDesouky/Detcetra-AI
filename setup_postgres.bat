@echo off
echo PostgreSQL Setup Helper

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo PostgreSQL is not found in PATH.
    echo Please make sure PostgreSQL 17 is installed and added to PATH.
    echo The default installation path should be: C:\Program Files\PostgreSQL\17\bin
    pause
    exit /b 1
)

echo PostgreSQL found. Let's set up the database...

REM Get PostgreSQL password
set /p PG_PASSWORD=Enter your PostgreSQL password (for user 'postgres'): 

REM Try to connect and create database
echo Attempting to create database...
psql -U postgres -c "CREATE DATABASE mammo_review;" 2>nul
if %errorlevel% neq 0 (
    echo.
    echo Failed to create database. Possible issues:
    echo 1. Wrong password for user 'postgres'
    echo 2. PostgreSQL service not running
    echo 3. PostgreSQL not properly installed
    echo.
    echo To fix:
    echo 1. Make sure you're using the correct password for user 'postgres'
    echo 2. Check if PostgreSQL service is running (services.msc)
    echo 3. Verify PostgreSQL installation in: C:\Program Files\PostgreSQL\17
    echo.
    pause
    exit /b 1
)

echo Database created successfully!
echo.
echo Next steps:
echo 1. Run setup_windows.bat to complete the application setup
echo 2. Make sure to use the same password when prompted
echo.
pause 