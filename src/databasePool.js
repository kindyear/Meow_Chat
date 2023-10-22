/*
    databasePool.js
*/
const mysql = require('mysql2');
const config = require('./config/config');

// 创建数据库连接池
const pool = mysql.createPool({
    host: config.MYSQL.HOST, // 数据库主机
    port: config.MYSQL.PORT, // 数据库端口
    user: config.MYSQL.USER, // 数据库用户名
    password: config.MYSQL.PASSWORD, // 数据库密码
    database: config.MYSQL.DATABASE // 数据库名称
});

// 导出连接池以在应用程序中使用
module.exports = pool;
