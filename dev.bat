@echo off

REM Ensure dependencies are installed
echo Installing dependencies...
call npm install

REM Install server dependencies
echo Installing server dependencies...
cd server
call npm install
cd ..

REM Run the application
echo Starting SPK-WP application...
call npm run start:all
