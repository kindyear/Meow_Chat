const express = require('express');
const {logTime} = require("../logTime");
const router = express.Router();

const register = require('../userRegister');

// 用户登录路由
router.get('/login', (req, res) => {
    console.log(`${logTime()} Request to \u001b[33m/login\u001b[0m from \u001b[33m${req.ip}\u001b[0m`);
    res.send('LOGIN ROUTE');
});

router.post('/register', async (req, res) => {
    console.log(`${logTime()} Request to \u001b[33m/register\u001b[0m from \u001b[33m${req.ip}\u001b[0m`);
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: '用户名和密码是必需的' });
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
