/*
    authRoutes.js
*/

const express = require('express');
const {logTime} = require("../logTime");
const router = express.Router();

const {upload, handleRegistration} = require('../userRegister');
const login = require('../userLogin');
const getAvatar = require('../getAvatar');


// 用户登录路由
router.post('/login', async (req, res) => {
    console.log(`${logTime()} Request to \u001b[33m/login\u001b[0m from \u001b[33m${req.ip}\u001b[0m`);
    const { username, password, captcha, apiKey} = req.body;
    const API_KEY = 'kindyear';
    if (apiKey === API_KEY) {
        // 使用 API 密钥验证用户
        const loginResult = await login.handleLogin(username, password);
        if (loginResult.success) {
            req.session.username = username;
            return res.redirect('../chat.html');
        } else {
            return res.status(400).json({ message: loginResult.message });
        }
    } else {
        // 请求中没有 API 密钥，继续验证图形验证码
        if (!username || !password || !captcha) {
            return res.status(400).json({ message: '用户名、密码和验证码是必需的' });
        }
        const storedCaptcha = req.session.captcha;
        if (!storedCaptcha) {
            return res.status(400).json({ message: '验证码已过期' });
        }
        if (captcha.toLowerCase() !== storedCaptcha.toLowerCase()) {
            return res.status(400).json({ message: '验证码不正确' });
        }

        // 使用图形验证码验证用户
        const loginResult = await login.handleLogin(username, password);
        if (loginResult.success) {
            req.session.username = username;
            return res.redirect('../chat.html');
        } else {
            return res.status(400).json({ message: loginResult.message });
        }
    }
});

router.post('/register', upload.single('avatar'), async (req, res) => {
    console.log(`${logTime()} Request to \u001b[33m/register\u001b[0m from \u001b[33m${req.ip}\u001b[0m`);
    const { username, password, captcha } = req.body;
    const avatar = req.file ? req.file.filename : null;

    console.log(`${logTime()} Uploaded file:`, req.file);
    console.log(`${logTime()} Avatar:`, avatar);

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
    const registrationResult = await handleRegistration(username, password, avatar);

    if (registrationResult.success) {
        req.session.username = username;
        return res.redirect('../login.html');
    } else {
        res.status(400).json({ message: registrationResult.message });
    }
});

router.get('/get-username', (req, res) => {
    const username = req.session.username;
    res.json({ username });
});

router.get('/get-avatar', async (req, res) => {
    let username = req.query.username || req.session.username; // 检查传入的参数，否则使用session的username

    if (!username) {
        return res.status(400).json({ message: '未提供用户名' });
    }

    const avatar = await getAvatar.getAvatar(username);

    if (avatar) {
        res.json({ avatar });
    } else {
        res.status(404).json({ message: '找不到用户或用户没有上传头像' });
    }
});



// router.get('/logout', (req, res) => {
//     console.log(`${logTime()} Request to \u001b[33m/logout\u001b[0m from \u001b[33m${req.ip}\u001b[0m`);
//     req.logout(); // 这里使用 Passport.js 的 logout 方法
//     req.session.destroy((err) => {
//         if (err) {
//             console.error(`Error destroying session: ${err}`);
//         }
//         res.redirect('/'); // Redirect to the main page or login page
//     });
// });

module.exports = router;