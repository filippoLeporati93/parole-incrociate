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

    // get socketid from userID private rooms
    const receiverSocketId = [...io.of('/').adapter.rooms.get(receiverUserID) ?? new Set()][0]; 
    if (receiverSocketId) {
      // get all rooms joined by the receiver
      const socketRoomsArray = [...io.of('/').adapter.socketRooms(receiverSocketId) ?? new Set()];
      // if the receiver is still in a gaming room emit a not accepted
      const gameRoomId = socketRoomsArray.find(e => e.startsWith("gameID:")) ?? ''
      const socketsInGameRoom = io.of('/').adapter.rooms.get(gameRoomId) ?? new Set();
      if(gameRoomId && socketsInGameRoom.size > 1) {
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

  @OnMessage("leave_game_room")
  public async leaveGameRoom(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
      // leave all gaming rooms
      const rooms = io.of('/').adapter.socketRooms(socket.id);
      if(rooms) {
        rooms.forEach(roomID => {
          if (roomID.startsWith("gameID:"))
            socket.leave(roomID);
        });
      }
  }
}
