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
    const requesterUserID = message.requesterUserID;
    const requesterUsername = message.requesterUsername;
    const receiverUserID = message.receiverUserID;
    const roomId = message.roomId;

    const socketRooms = io.of('/').adapter.socketRooms(receiverUserID);
    
    if(socketRooms) {
      const socketRoomsArray = [...socketRooms];
      if(socketRoomsArray.find(e => e.startsWith("gameID:"))) {
        socket.emit("room_joined", {
          accepted: false,
          roomId,
          responseUserID: receiverUserID,
          reason: 'IS_PLAYING',
          })
        return;
      }
    }

    socket.join(roomId);

    socket.to(receiverUserID).emit("join_room", { roomId, requesterUsername, requesterUserID }); 

  }

  @OnMessage("room_joined")
  public async responseJoinRoom(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
      // send the response to the request to join a room. If accepted join the room, else not.
      const roomId = message.roomId;
      const responseUserID = message.responseUserID;
      const accepted = message.accepted;
      if(accepted)
        socket.join(roomId);
      socket.to(roomId).emit("room_joined", {
        accepted,
        roomId,
        responseUserID,
        reason: 'USER_SELECTION'
      });
  }

  @OnMessage("start_game")
  public async startGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
      // message sent by the user who made the 'request_join_room'
      const roomId = message.roomId;
      const roomUsers = message.roomUsers;
      socket.to(roomId).emit("start_game", {firstPlayer: false, roomId, roomUsers});
  }
}
