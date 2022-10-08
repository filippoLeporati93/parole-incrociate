import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class RoomController {

  @OnMessage("join_game")
  public async joinGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    console.log("New User try joining room: ", message);

    let roomIdJoined: string = null;

    const rooms = io.sockets.adapter.rooms;
    try {
      for(const [roomId, sockets] of rooms) {
        if(roomId.startsWith("room_") && sockets.size < 2) {
          await socket.join(roomId);
          socket.emit("room_joined", {status: true});
          roomIdJoined = roomId;
        }
      }
    } catch (err) {
      socket.emit("room_join_error", {
        error: "Error in joining the room!",
      });
    }

    if (!roomIdJoined) {
      await socket.join("room_" + socket.id)
      socket.emit("room_joined", {status: true});
    } else {
      if (io.sockets.adapter.rooms.get(roomIdJoined).size === 2) {
        socket.to(roomIdJoined).emit("start_game", { start: false, roomId: roomIdJoined});
        socket.emit("start_game", { start: true, roomId: roomIdJoined})
      }
    }
  }
  
}
