/*
    chatRoutes.js
*/

const express = require('express');
const { logTime } = require('../logTime');
const router = express.Router();

module.exports = (io) => {

    function requireLogin(req, res, next) {
        if (req.session.username) {
            next(); // 用户已登录，继续处理请求
        } else {
            res.status(401).send('未登录'); // 用户未登录，返回未授权状态
        }
    }

    // 聊天页面路由
    router.get('/chat', (req, res) => {
        console.log(`${logTime()} Request to \u001b[33m/chat\u001b[0m from \u001b[33m${req.ip}\u001b[0m`);
        res.sendFile(__dirname + '../../public/chat.html');
    });

    // 聊天API端点
    router.post('/api/send-message', requireLogin,(req, res) => {
        const { message } = req.body;
        const username = req.session.username;
        const fullMessage = `${username}: ${message}`;
        io.emit('message', fullMessage);
        console.log(`${logTime()} Received message: ${fullMessage}`);
        res.status(200).send('消息已发送');
    });

    return router;
};
