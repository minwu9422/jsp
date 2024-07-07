const tls = require('tls');
const net = require('net');

const LOCAL_PORT = 30303;
const REMOTE_HOST = '172.64.102.151';
const REMOTE_PORT = 443;


const tlsOptions = {
    host: REMOTE_HOST,
    port: REMOTE_PORT,
    rejectUnauthorized: false // 
};
const remoteSocket = tls.connect(tlsOptions);

const server = net.createServer((localSocket) => {
    localSocket.on('data', (data) => {
        remoteSocket.write(data);
    });

    remoteSocket.on('data', (data) => {
        localSocket.write(data);
    });

    localSocket.on('close', () => {
        remoteSocket.end();
    });

    remoteSocket.on('close', () => {
        localSocket.end();
    });

    localSocket.on('error', (err) => {
        console.error('Local socket error:', err.message);
        localSocket.destroy();
        remoteSocket.end();
    });

    remoteSocket.on('error', (err) => {
        console.error('Remote socket error:', err.message);
        remoteSocket.destroy();
        localSocket.end();
    });
});

server.listen(LOCAL_PORT, () => {
    console.log(`Server listening on port ${LOCAL_PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err.message);
});

