import net from "net";
import { handleConnection } from "./handleConnection.js";

const server = net.createServer((socket) => {
    // handle connections
    socket.on("data", (data) => handleConnection(socket, data));
    socket.on("close", () => {
        socket.end();
    });
});
server.listen(4221, "localhost", () => {
    console.log('server is listening to the port 4221')
});
