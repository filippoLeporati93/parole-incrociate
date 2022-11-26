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

  @OnMessage("join_room")
  public async requestJoinRoom(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    // ask new user to join the room
    const requesterUserName = message.requesterUserName;
    const receiverUserName = message.receiverUserName;
    const roomId = message.roomId;

    socket.join(roomId);

    socket.to(receiverUserName).emit("join_room", { roomId, requesterUserName }); 

  }

  @OnMessage("room_joined")
  public async responseJoinRoom(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
      // send the response to the request to join a room. If accepted join the room, else not.
      const roomId = message.roomId;
      const responseUserName = message.responseUserName;
      const accepted = message.accepted;
      if(accepted)
        socket.join(roomId);
      socket.to(roomId).emit("room_joined", {accepted, roomId, responseUserName});
  }

  @OnMessage("start_game")
  public async startGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
      // message sent by the user who made the 'request_join_room'
      const roomId = message.roomId;
      socket.to(roomId).emit("start_game", {firstPlayer: false, roomId});
  }
}
