#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="dist", **kwargs)
    
    def do_GET(self):
        # 解析URL
        parsed_path = urlparse(self.path)
        file_path = parsed_path.path
        
        # 如果是根路径，重定向到index.html
        if file_path == '/':
            file_path = '/index.html'
        
        # 检查文件是否存在
        full_path = os.path.join("dist", file_path.lstrip('/'))
        
        if not os.path.exists(full_path) or os.path.isdir(full_path):
            # 文件不存在或是目录，返回index.html（用于Vue Router的history模式）
            self.path = '/index.html'
        
        # 调用父类方法处理请求
        return super().do_GET()

def main():
    PORT = 3000
    
    # 检查dist目录是否存在
    if not os.path.exists("dist"):
        print("错误：dist目录不存在，请先运行 'npm run build' 构建项目")
        sys.exit(1)
    
    # 启动服务器
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"超悦业务管理系统正在运行在 http://localhost:{PORT}")
        print("按 Ctrl+C 停止服务器")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务器已停止")

if __name__ == "__main__":
    main()
