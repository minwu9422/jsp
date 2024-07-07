const net = require('net');
const WebSocket = require('ws');

const LOCAL_PORT = 30303;
const REMOTE_WS_URL = 'wss://www.speedtest.net'; 

const remoteSocket = new WebSocket(REMOTE_WS_URL);

const server = net.createServer((localSocket) => {
    remoteSocket.on('open', () => {
        localSocket.on('data', (data) => {
            remoteSocket.send(data);
        });

        remoteSocket.on('message', (data) => {
            localSocket.write(data);
        });

        localSocket.on('close', () => {
            remoteSocket.close();
        });

        remoteSocket.on('close', () => {
            localSocket.end();
        });

        localSocket.on('error', (err) => {
            console.error('Local socket error:', err.message);
            localSocket.destroy();
            remoteSocket.close();
        });

        remoteSocket.on('error', (err) => {
            console.error('Remote socket error:', err.message);
            remoteSocket.close();
            localSocket.end();
        });
    });

    remoteSocket.on('error', (err) => {
        console.error('WebSocket connection error:', err.message);
        localSocket.destroy();
    });
});

server.listen(LOCAL_PORT, () => {
    console.log(`Server listening on port ${LOCAL_PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err.message);
});
