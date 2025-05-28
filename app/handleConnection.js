import fs from 'fs';
import path from 'path';

let baseDirectory = '.';

const args = process.argv;
const dirIndex = args.indexOf('--directory');
if (dirIndex !== -1 && args[dirIndex + 1]) {
    baseDirectory = args[dirIndex + 1];
}

export const handleConnection = (socket, data) => {
    const request = data.toString();
    console.log(request)
    const [requestHeaders, body] = request.split('\r\n\r\n');
    const lines = requestHeaders.split('\r\n');
    const [method, url, httpVersion] = lines[0].split(" ");

    const headers = {};
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line === '') break;

        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const headerName = line.substring(0, colonIndex).trim().toLowerCase();
            const headerValue = line.substring(colonIndex + 1).trim();
            headers[headerName] = headerValue;
        }
    }

    let responseStatusLine = '';
    let responseHeaders = [];
    let responseBody = '';

    if (url === "/" || url === '/index.html') {
        responseStatusLine = 'HTTP/1.1 200 OK\r\n';
    } else if (url.startsWith('/echo/')) {
        const message = url.split('/echo/')[1].toString() || "";
        responseStatusLine = 'HTTP/1.1 200 OK';
        const acceptEncoding = headers['accept-encoding'] || "";
        const encodings = acceptEncoding.split(',').map(e => e.trim());
        const isPresent = encodings.includes('gzip')

        if (isPresent) {
            responseHeaders = [
                "Content-Type: text/plain",
                `Content-Length: ${responseBody.length}`,
                "Content-Encoding: gzip",
                "", ""
            ];
        } else {
            responseHeaders = [
                "Content-Type: text/plain",
                `Content-Length: ${message.length}`,
                "", ""
            ];
        }
        responseBody = message;
    } else if (url === '/user-agent') {
        responseStatusLine = 'HTTP/1.1 200 OK';
        const userAgent = headers['user-agent'] || "";
        responseHeaders = [
            "Content-Type: text/plain",
            `Content-Length: ${userAgent.length}`,
            "", ""
        ];
        responseBody = userAgent;
    } else if (url.startsWith('/files/')) {
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
                socket.end();
                return;
            }
        } else if (method === 'POST') {
            fs.writeFileSync(filePath, body);
            responseStatusLine = 'HTTP/1.1 201 Created\r\n\r\n';
            socket.write(responseStatusLine);
            socket.end();
            return;
        }
    } else {
        responseStatusLine = 'HTTP/1.1 404 Not Found\r\n\r\n';
        socket.write(responseStatusLine);
        socket.end();
        return;
    }

    const completeResponse = `${responseStatusLine}\r\n${responseHeaders.join('\r\n')}${responseBody}`;
    socket.write(completeResponse);

    socket.end();
};
