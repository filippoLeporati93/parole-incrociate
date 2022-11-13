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

    let roomIdJoined: string | null = null;

    // if the message as already a join roomId use that
    if ('roomId' in message && message.roomId !== '') {
      const roomId = message.roomId;
      const sockets = io.sockets.adapter.rooms.get(roomId) ?? new Set();
      if (sockets.size < 2) {
        await socket.join(roomId);
        socket.emit("room_joined", { status: true });
      }
      // if the room you joined is ready and full, emit the start_game event to the players in the room.
      if (sockets.size === 2) {
        socket.to(roomId).emit("start_game", { start: false, roomId: roomIdJoined });
        socket.emit("start_game", { start: true, roomId: roomIdJoined })
      }
    } else {
      // no roomId in the message
      // search for an available RANDOM room and join it  
      const rooms = io.sockets.adapter.rooms;
      try {
        for (const [roomId, sockets] of rooms) {
          if (roomId.startsWith("room_") && sockets.size < 2) {
            await socket.join(roomId);
            socket.emit("room_joined", { status: true });
            roomIdJoined = roomId;
          }
        }
      } catch (err) {
        socket.emit("room_join_error", {
          error: "Error in joining the room!",
        });
      }

      // if no room are available create a new one and join it, then wait for other players
      if (!roomIdJoined) {
        await socket.join("room_" + socket.id)
        socket.emit("room_joined", { status: true });
      } else {
        // if the room you joined is ready and full, emit the start_game event to the players in the room.
        const sockets = io.sockets.adapter.rooms.get(roomIdJoined) ?? new Set();
        if (sockets.size === 2) {
          socket.to(roomIdJoined).emit("start_game", { start: false, roomId: roomIdJoined });
          socket.emit("start_game", { start: true, roomId: roomIdJoined })
        }
      }
    }
  }

}
