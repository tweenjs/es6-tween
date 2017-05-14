@echo off
set /P commit=Enter commit log: 
npm run dist
git commit -m "%commit%"
git push
echo Publishing...
echo Done... (if there no error)
pause