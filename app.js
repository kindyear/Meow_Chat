/*
    Meow Chat Backend
    Date: 2023/10/19
    Author: KINDYEAR
*/

// Import
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const passport = require('passport');
const session = require('express-session');
const config = require('./src/config/config'); // 引入配置文件
const packageInfo = require('./package.json'); // 引入package.json
const {logTime} = require('./src/logTime'); // 引入日志时间

// 启动日志
console.log(`${logTime()} Meow Chat Backend Starting...`);
console.log(`${logTime()} Version: \u001b[33m${packageInfo.version}\u001b[0m`);


// 设置Express中间件
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 配置Passport.js和会话
app.use(session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// 配置静态文件目录（例如，用于存放前端资源）
app.use(express.static('public'));

// 定义路由
app.get('/', (req, res) => {
    console.log(`${logTime()} Request to \u001b[33m/\u001b[0m from \u001b[33m${req.ip}\u001b[0m`);
    res.send('MAIN ROUTE');
});

// 路由导入
const captchaRoutes = require('./src/routes/captchaRoutes');
const authRoutes = require('./src/routes/authRoutes');
const chatRoutes = require('./src/routes/chatRoutes');

// 挂载路由模块
app.use('/captcha', captchaRoutes);
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

// 启动Socket.IO并处理WebSocket事件
io.on('connection', (socket) => {
    console.log('A user connected.');

    // 处理聊天消息
    socket.on('chat message', (message) => {
        io.emit('chat message', message); // 广播消息给所有连接的客户端
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});

// 启动Express服务器
const port = config.PORT || 3000;
http.listen(port, () => {
    console.log(`${logTime()} Server is running on port \u001b[33m${port}\u001b[0m`);
});
