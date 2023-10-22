/*
    userLogin.js
*/

const crypto = require('crypto');
const db = require('./databasePool');
const { logTime } = require("./logTime");

// 处理用户登录逻辑
async function handleLogin(username, inputPassword) {
    // 检查用户名是否存在
    const user = await getUserByUsername(username);

    if (!user) {
        return { success: false, message: '用户不存在' };
    }

    // 验证密码
    if (verifyPassword(inputPassword, user.password)) {
        console.log(`${logTime()} User logged in: username: \u001b[33m${username}\u001b[0m`);
        return { success: true, message: '登录成功' };
    } else {
        return { success: false, message: '密码不正确' };
    }
}

// 获取用户信息通过用户名
async function getUserByUsername(username) {
    const query = 'SELECT username, password FROM users WHERE username = ?';
    const [rows, fields] = await db.promise().query(query, [username]);
    return rows[0]; // 返回第一个匹配的用户或 null
}


// 对密码进行SHA-256哈希处理
function hashPassword(inputPassword) {
    const sha256 = crypto.createHash('sha256');
    sha256.update(inputPassword);
    return sha256.digest('hex');
}

// 验证密码
function verifyPassword(inputPassword, rawPassword) {
    const hashedInputPassword= hashPassword(inputPassword);//对用户输入的密码进行哈希加密处理
    return hashedInputPassword === rawPassword;

}

module.exports = {
    handleLogin
};