/*
    userRegister.js
*/

const crypto = require('crypto'); // 用于SHA-256哈希
const db = require('./databasePool');
const multer = require('multer'); // 用于处理上传的文件
const path = require('path'); // 用于处理文件路径
const { logTime } = require('./logTime');

// 配置 Multer 存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/avatars'); // 指定存储目录
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        cb(null, Date.now() + extname); // 为文件重命名
    },
});

const upload = multer({ storage: storage });

// 处理用户注册逻辑
async function handleRegistration(username, password, avatar) {

    // 检查用户名是否已经存在
    const userExists = await checkIfUserExists(username);

    if (userExists) {
        return { success: false, message: '用户名已存在' };
    }

    // 对密码进行SHA-256哈希处理
    const hashedPassword = hashPassword(password);

    // 将用户信息存储到数据库
    const query = 'INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)';
    try {
        const [rows, fields] = await db.promise().query(query, [username, hashedPassword, avatar]);
        console.log(`${logTime()} New user registered: username: \u001b[33m${username}\u001b[0m`);
        return { success: true, message: '注册成功' };
    } catch (err) {
        console.error(`${logTime()} Error registering user:`, err);
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
    handleRegistration,
    upload,
};
