@echo off
cd /d "%~dp0..\backend"
call bundle exec rails server
