export const handleConnection = (socket, data) => {
    // get the request
    const request = data.toString();

    const lines = request.split('\r\n');
    const [method, url, httpVersion] = lines[0].split(" ");  
    
    const headers = {};
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line === '') break; 

        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const headerName = line.substring(0, colonIndex).trim();
            const headerValue = line.substring(colonIndex + 1).trim();
            headers[headerName.toLowerCase()] = headerValue; 
        }
    }
    
    let responseStatusLine = '';
    let responseHeaders = [];
    let responseBody = '';

    if(url === "/" || url === '/index.html') {
        responseStatusLine = 'HTTP/1.1 200 OK\r\n';
    } else if (url.startsWith('/echo/')) {
        const message = url.split('/')[2] || ""
        responseStatusLine = 'HTTP/1.1 200 OK';
        responseHeaders = [
            "Content-Type: text/plain",
            `Content-Length: ${message.length}`,
            "", ""
        ];
        responseBody = message;
    } else if (url === '/user-agent') {
        responseStatusLine = 'HTTP/1.1 200 OK';
        const userAgent = headers['user-agent'] || "";
        responseHeaders = [
            "Content-Type: text/plain",
            `Content-Length: ${userAgent.length}`,
            "", ""
        ]
        responseBody = userAgent;
    } else {
        responseStatusLine = 'HTTP/1.1 404 Not Found\r\n';
    }

    const completeResponse = `${responseStatusLine}\r\n${responseHeaders.join("\r\n")}${responseBody}`
    console.log(completeResponse);
    socket.write(completeResponse);
    socket.end();
}

// {
//         const request = data.toString();
//         console.log(request);

//         const lines = request.split('\r\n');
//         const [method, url, httpVersion] = lines[0].split(" ");

        
//         const message = url.split('/')[2] || "";
//         const headers = [
//             "HTTP/1.1 200 OK",
//             "Content-Type: text/plain",
//             `Content-Length: ${message.length}`,
//             "", ""
//         ];

//         if (url === '/' || url === '/index.html') {
//             socket.write("HTTP/1.1 200 OK\r\n\r\n");

//         } else if (url.startsWith('/echo/')) {
//             socket.write(headers.join("\r\n") + message);

//         } else if(url === "/user-agent") {
//             for (const line of lines) {
//                 if (line.startsWith('User-Agent: ')) {
//                     const userAgent = line.substring('User-Agent: '.length).trim();
//                     socket.write(headers.join("\r\n") + userAgent);
//                 }
//             }

//         } else {
//             socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
//         }
//         socket.end();
//     }