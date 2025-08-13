@echo off
title 超悦业务管理系统
color 0A
echo.
echo ========================================
echo     超悦业务管理系统 v1.0.0
echo ========================================
echo.
echo 正在启动服务器...
echo.

REM 尝试使用Python服务器
python -m http.server 3000 --directory dist 2>nul
if %errorlevel% equ 0 (
    echo 服务器启动成功！
    echo.
    echo 请在浏览器中访问: http://localhost:3000
    echo.
    echo 按 Ctrl+C 停止服务器
    echo ========================================
    pause
) else (
    echo Python服务器启动失败，尝试Node.js服务器...
    node serve-dist.js
    pause
)
