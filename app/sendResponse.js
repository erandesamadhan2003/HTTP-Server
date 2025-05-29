import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

let baseDirectory = '.';

const args = process.argv;
const dirIndex = args.indexOf('--directory');
if (dirIndex !== -1 && args[dirIndex + 1]) {
    baseDirectory = args[dirIndex + 1];
}

let responseStatusLine = '';
let responseHeaders = [];
let responseBody = '';

export const handleEchoRequest = (socket, headers, url) => {
    const message = url.split('/echo/')[1] || "";
    responseStatusLine = 'HTTP/1.1 200 OK\r\n';
    const acceptEncoding = headers['accept-encoding'] || "";
    const encodings = acceptEncoding.split(',').map(e => e.trim());

    if (encodings.includes('gzip')) {
        const compressed = zlib.gzipSync(message);

        responseHeaders = [
            "Content-Type: text/plain",
            `Content-Length: ${compressed.length}`,
            "Content-Encoding: gzip",
            "Connection: close"
        ];

        socket.write(responseStatusLine);
        socket.write(responseHeaders.join('\r\n'));
        socket.write('\r\n\r\n');
        socket.write(compressed);
        return;
    } else {
        responseStatusLine = 'HTTP/1.1 200 OK\r\n';
        responseHeaders = [
            "Content-Type: text/plain",
            `Content-Length: ${Buffer.byteLength(message, 'utf8')}`,
            "Connection: close"
        ];

        socket.write(responseStatusLine);
        socket.write(responseHeaders.join('\r\n'));
        socket.write('\r\n\r\n');
        socket.write(message);
        return;
    }
}

export const handleUserAgentRequest = (socket, headers) => {
    responseStatusLine = 'HTTP/1.1 200 OK';
    const userAgent = headers['user-agent'] || "";
    responseHeaders = [
        "Content-Type: text/plain",
        `Content-Length: ${userAgent.length}`,
        "", ""
    ];
    responseBody = userAgent;

    const completeResponse = `${responseStatusLine}\r\n${responseHeaders.join('\r\n')}${responseBody}`;
    socket.write(completeResponse);
}

export const handleFileRequest = (socket, method, url, body) => {
    const filename = url.split('/files/')[1];
    const filePath = path.join(baseDirectory, filename);

    if (method === 'GET') {
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath);
            responseStatusLine = 'HTTP/1.1 200 OK';
            responseHeaders = [
                "Content-Type: application/octet-stream",
                `Content-Length: ${fileData.length}`,
                "", ""
            ];
            responseBody = fileData;
        } else {
            responseStatusLine = 'HTTP/1.1 404 Not Found\r\n\r\n';
            socket.write(responseStatusLine);
            return;
        }
    } else if (method === 'POST') {
        fs.writeFileSync(filePath, body);
        responseStatusLine = 'HTTP/1.1 201 Created\r\n\r\n';
        socket.write(responseStatusLine);
        return;
    }

    const completeResponse = `${responseStatusLine}\r\n${responseHeaders.join('\r\n')}${responseBody}`;
    socket.write(completeResponse);
}