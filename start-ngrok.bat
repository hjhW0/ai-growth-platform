@echo off
if "%NGROK_AUTHTOKEN%"=="" (
    echo Error: NGROK_AUTHTOKEN environment variable is not set.
    echo Run: setx NGROK_AUTHTOKEN "your_token_here"
    pause
    exit /b 1
)
echo Starting ngrok tunnel on port 5000...
"C:\Users\ASUS\AppData\Local\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe" http --authtoken=%NGROK_AUTHTOKEN% 5000
pause
