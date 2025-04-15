@echo off
setlocal enabledelayedexpansion

echo Setting up Breast Implant DX Platform...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python 3.8 or later.
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r backend\requirements.txt

REM Initialize Alembic
echo Setting up database migrations...
cd backend
alembic init migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
cd ..

REM Create .env file
echo Creating .env file...
(
echo SECRET_KEY=%RANDOM%%RANDOM%%RANDOM%%RANDOM%%RANDOM%%RANDOM%%RANDOM%%RANDOM%
echo DATABASE_URL=sqlite:///./breast_implant_dx.db
echo ALGORITHM=HS256
echo ACCESS_TOKEN_EXPIRE_MINUTES=30
echo REFRESH_TOKEN_EXPIRE_DAYS=7
echo MAX_LOGIN_ATTEMPTS=5
echo ACCOUNT_LOCKOUT_MINUTES=30
) > backend\.env

REM Create necessary directories
echo Creating necessary directories...
mkdir static 2>nul
mkdir static\uploads 2>nul
mkdir static\uploads\images 2>nul
mkdir static\uploads\reports 2>nul
mkdir static\uploads\heatmaps 2>nul

REM Initialize database
echo Initializing database...
python backend\init_db.py

echo Setup completed successfully!
echo To start the application, run: start_app.bat

endlocal 