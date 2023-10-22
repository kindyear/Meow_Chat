const socketIo = require('socket.io');

function initializeWebSocketServer(server) {
    const io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('message', (data) => {
            console.log('Received message:', data);

            // 假设 data 包含了用户名和消息内容
            const { username, message } = data;

            // 构建带用户名前缀的消息
            const fullMessage = `${username}: ${message}`;

            // 发送带用户名前缀的消息
            io.emit('message', fullMessage);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });

    return io; // 导出 io 对象
}

module.exports = initializeWebSocketServer;
