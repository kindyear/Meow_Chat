/*
    captchaRoutes.js
*/
const router = require('express').Router();
const svgCaptcha = require('svg-captcha');
const {logTime} = require("../logTime");

router.get('/', (req, res) => {
    const captcha = svgCaptcha.create({
        ignoreChars: '0oO',
    });
    req.session.captcha = captcha.text; // 存储验证码文本到会话
    console.log(`${logTime()} Captcha generated: \u001b[33m${req.session.captcha}\u001b[0m`);
    res.type('svg');
    res.status(200).send(captcha.data);
});

module.exports = router;