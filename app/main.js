// const net = require("net");
import net from "net";

console.log("Logs from your program will appear here!");
const server = net.createServer((socket) => {
        socket.on("data", (data) => {
        const request = data.toString();
        console.log("Request received:\n", request);

        // Extract the path from the request line
        const requestLine = request.split("\r\n")[0]; // e.g., "GET /raspberry HTTP/1.1"
        const [method, path] = requestLine.split(" ");

        if (path === "/") {
        // Write the HTTP 200 OK respone
        // HTTP/1.1 version of the http protocol
        // 200 ok the status code and the status message. 200 means the success
        // \r\n\r\n — a blank line to separate headers from the body writtern inside the \r\n `Actual content` \r\n
            socket.write("HTTP/1.1 200 OK\r\n\r\n");
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
