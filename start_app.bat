@echo off
setlocal enabledelayedexpansion

echo Starting Breast Implant DX Platform...

REM Activate virtual environment
call venv\Scripts\activate

REM Start backend server with proper settings
start "Backend Server" cmd /k "cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Start frontend development server
cd frontend
start "Frontend Server" cmd /k "npm start"

echo Application started!
echo Backend running at: http://localhost:8000
echo Frontend running at: http://localhost:3000
echo.
echo Press any key to stop all servers...
pause

REM Kill all servers
taskkill /F /FI "WINDOWTITLE eq Backend Server*" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq Frontend Server*" >nul 2>&1

REM Deactivate virtual environment
call ..\venv\Scripts\deactivate

endlocal 