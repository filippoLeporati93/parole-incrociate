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

    socket.on("disconnecting", (reason) => {
      for (const roomId of socket.rooms) {
        if (roomId.startsWith("room_")) {
            const sockets = io.sockets.adapter.rooms.get(roomId) ?? new Set();
            const playersRemaining = sockets.size - 1;
            console.log("playersRemaining:" + playersRemaining);
            socket.to(roomId).emit("on_player_leaving", {socketId: socket.id, playersRemaining, reason});
        }
      }
    });

  }
  
}
