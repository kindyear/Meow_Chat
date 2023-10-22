const express = require('express');
const {logTime} = require("../logTime");
const router = express.Router();

const register = require('../userRegister');
const login = require('../userLogin');


// 用户登录路由
router.post('/login', async (req, res) => {
    console.log(`${logTime()} Request to \u001b[33m/login\u001b[0m from \u001b[33m${req.ip}\u001b[0m`);
    const { username, password, captcha} = req.body;
    if (!username || !password || !captcha) {
        return res.status(400).json({ message: '用户名、密码和验证码是必需的' });
    }
    const storedCaptcha = req.session.captcha; // 从会话中获取存储的验证码
    if(!storedCaptcha) {
        return res.status(400).json({ message: '验证码已过期' });
    }
    if (captcha.toLowerCase() !== storedCaptcha.toLowerCase()) {
        return res.status(400).json({ message: '验证码不正确' });
    }

    const loginResult = await login.handleLogin(username, password);
    if (loginResult.success) {
        res.status(200).json({ message: loginResult.message });
    } else {
        res.status(400).json({ message: loginResult.message });
    }
});

router.post('/register', async (req, res) => {
    console.log(`${logTime()} Request to \u001b[33m/register\u001b[0m from \u001b[33m${req.ip}\u001b[0m`);
    const { username, password, captcha } = req.body;
    if (!username || !password || !captcha) {
        return res.status(400).json({ message: '用户名、密码和验证码是必需的' });
    }
    const storedCaptcha = req.session.captcha; // 从会话中获取存储的验证码
    if(!storedCaptcha) {
        return res.status(400).json({ message: '验证码已过期' });
    }
    if (captcha.toLowerCase() !== storedCaptcha.toLowerCase()) {
        return res.status(400).json({ message: '验证码不正确' });
    }

    const registrationResult = await register.handleRegistration(username, password);

    if (registrationResult.success) {
        res.status(200).json({ message: registrationResult.message });
    } else {
        res.status(400).json({ message: registrationResult.message });
    }
});

router.get('/logout', (req, res) => {
    console.log(`${logTime()} Request to \u001b[33m/logout\u001b[0m from \u001b[33m${req.ip}\u001b[0m`);
    res.send('LOGOUT ROUTE');
});

module.exports = router;
