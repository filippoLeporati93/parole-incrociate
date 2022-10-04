import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import { Engine } from "../../game_engine/Engine";

@SocketController()
export class GameController {

  private getSocketGameRoom(socket: Socket): string {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    const gameRoom: string = socketRooms && socketRooms[0];

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
      opponentLetter: letter,
    }
    const gameRoom = this.getSocketGameRoom(socket);
    socket.to(gameRoom).emit("on_game_update", responseData);
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
