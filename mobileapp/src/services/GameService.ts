import { Socket } from "socket.io-client";

export type IPlayMatrix = Array<Array<string>>;

export interface IStartGame {
  start: boolean;
  symbol: "A";
}

class GameService {
  
  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit("join_game", { roomId });
      socket.on("room_joined", () => rs(true));
      socket.on("room_join_error", ({ error }) => rj(error));
    });
  }

  public async updateGame(socket: Socket, cellIndexPressed: {dx:number,dy:number}, letter: string, opponentMatrix: IPlayMatrix) {
    socket.emit("update_game", { grid: opponentMatrix, letter: {value: letter, location: cellIndexPressed} });
  }

  public async onGameUpdate(
    socket: Socket,
    callback : (opponentLetter: string, opponentMatrix: IPlayMatrix) => void
  ) {
    socket.on("on_game_update", ({ opponentLetter, opponentMatrix }) => callback(opponentLetter, opponentMatrix));
  }

  public async onStartGame(
    socket: Socket,
    callback: (options: IStartGame) => void
  ) {
    socket.on("start_game", callback);
  }

  public async gameFinish(socket: Socket, message: string) {
    socket.emit("game_finish", { message });
  }

  public async onGameFinish(socket: Socket, callback: (message: string) => void) {
    socket.on("on_game_finish", ({ message }) => callback(message));
  }

  public async checkGame(matrix: IPlayMatrix, opponentMatrix: IPlayMatrix) {
    return [true,false];
  }
}

export default new GameService();