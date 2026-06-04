# Start ngrok tunnel
$ngrokPath = "C:\Users\ASUS\AppData\Local\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe"

if (-not $env:NGROK_AUTHTOKEN) {
    Write-Host "Error: NGROK_AUTHTOKEN environment variable is not set." -ForegroundColor Red
    Write-Host "Run: [Environment]::SetEnvironmentVariable('NGROK_AUTHTOKEN', 'your_token_here', 'User')"
    exit 1
}

Write-Host "Starting ngrok tunnel on port 5000..." -ForegroundColor Green
& $ngrokPath http --authtoken=$env:NGROK_AUTHTOKEN 5000
