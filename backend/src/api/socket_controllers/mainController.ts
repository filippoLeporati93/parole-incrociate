import {
  ConnectedSocket,
  OnConnect,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Socket, Server } from "socket.io";

@SocketController()
export class MainController {

  @OnConnect()
  public onConnection(
    @ConnectedSocket() socket: Socket,
    @SocketIO() io: Server
  ) {
    console.log("New Socket connected: ", socket.id);

    socket.on('disconnect', () => {
      console.log('user disconnected: ' + socket.id);
    });

    io.of("/").adapter.on("leave-room", (room, id) => {
      const socketId = id;
      const roomId = room;
      if(roomId.startsWith("room_")) {
        const playersRemaining = io.sockets.adapter.rooms.get(roomId).size - 1;
        console.log("playersRemaining:" + playersRemaining);
        io.to(roomId).emit("on_player_leaving", {playersRemaining});
      }
    });
  }
  
}
