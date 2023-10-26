/*
    websocketServer.js
*/

const socketIo = require('socket.io');
const { logTime } = require('./logTime');
function initializeWebSocketServer(server) {
    const io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        }
    });

    io.on('connection', (socket) => {
        console.log(`${logTime()} A user connected`);
        socket.on('message', async (data) => {
            console.log(`${logTime()} Received message:`, data);
            // 发送带用户名前缀的消息
            io.emit('message', data);
        });
        socket.on('disconnect', () => {
            console.log(`${logTime()} A user disconnected`);
        });
    });

    return io; // 导出 io 对象
}

module.exports = initializeWebSocketServer;
