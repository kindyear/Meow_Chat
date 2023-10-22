/*
    userRegister.js
*/

const crypto = require('crypto'); // 用于SHA-256哈希
const db = require('./databasePool');
const {logTime} = require("./logTime"); // 引入数据库连接池

// 处理用户注册逻辑
async function handleRegistration(username, password) {
    // 检查用户名是否已经存在
    const userExists = await checkIfUserExists(username);

    if (userExists) {
        return { success: false, message: '用户名已存在' };
    }

    // 对密码进行SHA-256哈希处理
    const hashedPassword = hashPassword(password);

    // 将用户信息存储到数据库
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    try {
        const [rows, fields] = await db.promise().query(query, [username, hashedPassword]);
        console.log(`${logTime()} New user register: username: \u001b[33m${username}\u001b[0m`);
        return { success: true, message: '注册成功' };
    } catch (err) {
        console.error('Error registering user:', err);
        return { success: false, message: '注册失败' };
    }
}

// 检查用户名是否已存在
async function checkIfUserExists(username) {
    const query = 'SELECT username FROM users WHERE username = ?';
    const [rows, fields] = await db.promise().query(query, [username]);
    return rows && rows.length > 0;
}

// 对密码进行SHA-256哈希处理
function hashPassword(password) {
    const sha256 = crypto.createHash('sha256');
    sha256.update(password);
    return sha256.digest('hex');
}

module.exports = {
    handleRegistration
};