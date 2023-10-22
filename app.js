/*
    Meow Chat Backend
    Date: 2023/10/19
    Author: KINDYEAR
*/

// Import
const express = require('express');
const app = express();
const http = require('http').Server(app);
const passport = require('passport');
const session = require('express-session');
const config = require('./src/config/config'); // 引入配置文件
const packageInfo = require('./package.json'); // 引入package.json
const {logTime} = require('./src/logTime'); // 引入日志时间
const cors = require('cors'); // 引入跨域模块
const initializeWebSocketServer = require('./src/websocketServer'); // 引入WebSocket服务器

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
app.use(cors());

// 配置静态文件目录（例如，用于存放前端资源）
app.use(express.static('public'));

// 定义路由
app.get('/', (req, res) => {
    console.log(`${logTime()} Request to \u001b[33m/\u001b[0m from \u001b[33m${req.ip}\u001b[0m`);
    res.send('MAIN ROUTE');
});

const io = initializeWebSocketServer(http);

// 路由导入
const captchaRoutes = require('./src/routes/captchaRoutes');
const authRoutes = require('./src/routes/authRoutes');
const chatRoutes = require('./src/routes/chatRoutes')(io);

// 挂载路由模块
app.use('/captcha', captchaRoutes);
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);


// 启动Express服务器
const port = config.PORT || 3000;
http.listen(port, () => {
    console.log(`${logTime()} Server is running on port \u001b[33m${port}\u001b[0m`);
});
