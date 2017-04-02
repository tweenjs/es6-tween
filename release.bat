@echo off
set /P commit=Enter commit log: 
git commit -m "%commit%"
git push
echo Publishing...
npm publish
echo Done... (if there no error)
pause