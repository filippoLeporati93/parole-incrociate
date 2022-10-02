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
    console.log("New User joining room: ", message);

    let roomIdJoined: string = null;

    const rooms = io.sockets.adapter.rooms;
    try {
      for(const [roomId, sockets] of rooms) {
        if(roomId !== socket.id && sockets.size < 2) {
          await socket.join(roomId);
          socket.emit("room_joined");
          roomIdJoined = roomId;
        }
      }
    } catch (err) {
      socket.emit("room_join_error", {
        error: "Error in joining the room!",
      });
    }

    if (!roomIdJoined) {
      socket.emit("room_join_error", {
        error: "Room is full please choose another room to play!",
      });
    } else {
      if (io.sockets.adapter.rooms.get(roomIdJoined).size === 2) {
        io.in(roomIdJoined)
          .emit("start_game", { roomId: roomIdJoined, yourTurn: roomIdJoined === socket.id});
      }
    }
  }
  
}
