import { useSocketServer } from "socket-controllers";
import { Server } from "socket.io";

export default (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
  },
  });

  io.use((socket, next) => {
     const token = socket.handshake.auth.token;
     if(token === process.env.API_TOKEN)
       return next();
     else
       return next(new Error('unauthorized'));
  })
  
  useSocketServer(io, { controllers: [__dirname + "/api/socket_controllers/*"] });

  return io;
};
