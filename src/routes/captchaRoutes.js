/*
    captchaRoutes.js
*/
const router = require('express').Router();
const svgCaptcha = require('svg-captcha');

router.get('/', (req, res) => {
    const captcha = svgCaptcha.create();
    res.type('svg');
    res.status(200).send(captcha.data);
});

module.exports = router;