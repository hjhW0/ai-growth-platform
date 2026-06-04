@echo off
echo Starting AI Growth Platform backend...
cd /d "%~dp0backend"
call venv\Scripts\activate
python app.py
pause
