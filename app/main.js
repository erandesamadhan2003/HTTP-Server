// const net = require("net");
import net from "net";

console.log("Logs from your program will appear here!");
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        //  request data of the client
        console.log(data.toString());
        
        // Write the HTTP 200 OK respone
        // HTTP/1.1 version of the http protocol
        // 200 ok the status code and the status message. 200 means the success
        // \r\n\r\n — a blank line to separate headers from the body writtern inside the \r\n `Actual content` \r\n
        socket.write("HTTP/1.1 200 OK\r\n\r\n");

        socket.end()
    })
    socket.on("close", () => {
        socket.end();
    });
});
server.listen(4221, "localhost", () => {
    console.log('server is listening to the port 4221')
});
