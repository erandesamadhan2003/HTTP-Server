// const net = require("net");
import net from "net";

console.log("Logs from your program will appear here!");
const server = net.createServer((socket) => {
        socket.on("data", (data) => {
            const request = data.toString();
            const lines = request.split('\r\n');
            const [method, url, httpVersion] = lines[0].split(" ");
            
            if (url === '/' || url === '/index.html') {
                // Write the HTTP 200 OK respone
                // HTTP/1.1 version of the http protocol
                // 200 ok the status code and the status message. 200 means the success
                // \r\n\r\n — a blank line to separate headers from the body writtern inside the \r\n `Actual content` \r\n
                socket.write("HTTP/1.1 200 OK\r\n\r\n");
            } else if (url.startsWith('/echo/')) {
                const message = url.split('/')[2] || "";
                const headers = [
                    "HTTP/1.1 200 OK",
                    "Content-Type: text/plain",
                    `Content-Length: ${message.length}`,
                    "", ""
                ];
                socket.write(headers.join("\r\n") + message);
            } else {
                socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            }
        socket.end();
    });

    socket.on("close", () => {
        socket.end();
    });
});
server.listen(4221, "localhost", () => {
    console.log('server is listening to the port 4221')
});
