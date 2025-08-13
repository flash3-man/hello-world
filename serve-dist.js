const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'dist')));

// 处理所有路由，返回index.html（用于Vue Router的history模式）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`超悦业务管理系统正在运行在 http://localhost:${port}`);
  console.log('按 Ctrl+C 停止服务器');
});
