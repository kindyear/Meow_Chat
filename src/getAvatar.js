/*
    getAvatar.js
*/

const db = require('./databasePool');

async function getAvatar(username) {
    const query = 'SELECT avatar FROM users WHERE username = ?';
    const [rows, fields] = await db.promise().query(query, [username]);
    if (rows && rows.length > 0) {
        return rows[0].avatar;
    }
    return null;
}

module.exports = {
    getAvatar,
}