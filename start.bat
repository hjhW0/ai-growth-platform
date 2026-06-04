@echo off
echo ================================
echo AI 成长平台 - 一键启动
echo ================================
echo.

echo [1/3] 打包前端...
cd frontend
call npm run build
cd ..
echo 前端打包完成！
echo.

echo [2/3] 启动后端（含前端静态文件）...
cd backend
start cmd /k "venv\Scripts\activate && python app.py"
cd ..
echo 后端启动中...
echo.

echo [3/3] 等待5秒后启动 ngrok...
timeout /t 5 /nobreak >nul
start cmd /k "start-ngrok.bat"

echo.
echo ================================
echo 启动完成！
echo.
echo 本地访问: http://localhost:5000
echo 公网访问: 查看 ngrok 窗口中的链接
echo ================================
pause
