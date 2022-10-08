import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class GameController {

  private getSocketGameRoom(socket: Socket): string {
    const socketRooms = Array.from(socket.rooms.values()).filter(r => r.startsWith("room_"));
    const gameRoom: string = socketRooms && socketRooms.pop();

    return gameRoom;
  }

  @OnMessage("update_game")
  public async updateGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    console.log(message);
    let letter = message.letter;
    let level = message.level;
  
    const responseData = {
      opponentLetter: letter.value,
    }
    const gameRoom = this.getSocketGameRoom(socket);
    socket.to(gameRoom).emit("on_update_game", responseData);
  }

  @OnMessage("game_finish")
  public async gameFinish(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    console.log(message);
    let matrix = message.matrix;
  
    const responseData = {
      opponentMatrix: matrix,
    }
    const gameRoom = this.getSocketGameRoom(socket);
    socket.to(gameRoom).emit("on_game_finish", responseData);
  }

  @OnMessage("game_win")
  public async gameWin(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const gameRoom = this.getSocketGameRoom(socket);
    socket.to(gameRoom).emit("on_game_win", message);
  }
}
