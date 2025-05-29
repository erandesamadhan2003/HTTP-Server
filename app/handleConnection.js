import { handleEchoRequest, handleFileRequest, handleUserAgentRequest } from './sendResponse.js';

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

    switch (true) {
        case (url === "/" || url === '/index.html'):
            socket.write('HTTP/1.1 200 OK\r\n\r\n');
            break;

        case url.startsWith('/echo/'):
            handleEchoRequest(socket, headers, url);
            break;

        case (url === '/user-agent'):
            handleUserAgentRequest(socket, headers);
            break;

        case url.startsWith('/files/'):
            handleFileRequest(socket, method, url, body);
            break;

        default:
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            break;
    }

    if(headers['connection'] === 'close') socket.end();
};
