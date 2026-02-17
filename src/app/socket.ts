import { Server } from "socket.io";

 let io: Server;

export const initSocket = (server: any) => {

    io =  new Server(server, { cors: { origin: "*" } });
    console.log("Socket Running");
};

export const getIO = () => io;
