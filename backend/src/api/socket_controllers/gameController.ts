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

  @OnMessage("update_game")
  public async updateGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    let letter = message.letter;
    let level = message.level;
    const roomId = message.roomId;
  
    const responseData = {
      opponentLetter: letter.value,
    }
    socket.to(roomId).emit("on_update_game", responseData);
  }

  @OnMessage("game_finish")
  public async gameFinish(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    let matrix = message.matrix;
    const roomId = message.roomId;
  
    const responseData = {
      opponentMatrix: matrix,
    }

    await socket.to(roomId).emit("on_game_finish", responseData);

    // leave the game room when game finished
    await socket.leave(roomId);
  }

  @OnMessage("game_win")
  public async gameWin(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const roomId = message.roomId;
    socket.to(roomId).emit("on_game_win", message);
  }
}
