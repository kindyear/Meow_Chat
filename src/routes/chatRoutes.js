const express = require('express');
const {logTime} = require("../logTime");
const router = express.Router();

// 聊天页面路由
router.get('/chat', (req, res) => {
    console.log(`${logTime()} Request to \u001b[33m/chat\u001b[0m from \u001b[33m${req.ip}\u001b[0m`);
    res.sendFile(__dirname + '/public/chat.html');
});

// 聊天API端点
router.post('/api/send-message', (req, res) => {
    // 处理发送消息
    const {userID, subGuild , token , content} = req.body;
});

module.exports = router;
