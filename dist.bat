@echo off
echo Packaging files...
npm run dist
@echo Testing...
npm run test
@echo All is runned fine, if there no error
pause;