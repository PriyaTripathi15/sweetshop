@echo off
echo 🍬 Starting Sweet Shop Management System...
echo.

REM Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo ✅ Dependencies installed!
echo.
echo 🚀 Starting servers...
echo.
echo Backend will start on: http://localhost:5000
echo Frontend will start on: http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop the servers
echo.

REM Start backend in new window
start "Sweet Shop Backend" cmd /k "cd backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "Sweet Shop Frontend" cmd /k "cd frontend && npm start"

echo.
echo ✅ Both servers are starting in separate windows!
echo.
pause
