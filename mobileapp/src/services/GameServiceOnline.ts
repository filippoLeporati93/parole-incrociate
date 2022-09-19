import FetchWrapper from "../api/FetchWrapper";
import { IPlayMatrix } from "./GameServiceFactory";
import SocketService from "./SocketService";


const GameServiceOnline = () => {

  const opponentMatrix : IPlayMatrix = [
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
  ];
  
  async function joinGameRoom(roomId: string) {
    const socket = SocketService.socket;
    if(socket) {
      return new Promise((rs, rj) => {
        socket.emit("join_game", { roomId });
        socket.on("room_joined", () => rs(true));
        socket.on("room_join_error", ({ error }) => rj(error));
      });
    }
  }

  async function updateGame(
     cellIndexPressed: {dx:number,dy:number},
     letter: string,
     onGameUpdate:(opponentLetter: string, isGridCompleted: boolean) => void) {
    const socket = SocketService.socket;
    if(socket) {
      socket.emit("update_game", { grid: opponentMatrix, letter: {value: letter, location: cellIndexPressed} });
      socket.on("on_game_update", ({ opponentLetter, isGridCompleted }) => onGameUpdate(opponentLetter, isGridCompleted));
    }
  }


  async function onStartGame(callback: (options: any) => void) {
    const socket = SocketService.socket;
    if(socket)
      socket.on("start_game", callback);
  }

  async function gameFinish(matrix: IPlayMatrix, onGameFinish: (results: any[]) => void) {
    const socket = SocketService.socket;
    if(socket) {
      socket.emit("game_finish", { matrix });
      socket.on("on_game_finish", ({ message }) => onGameFinish(message));
    }
  }


  return {
    joinGameRoom,
     updateGame,
     onStartGame,
     gameFinish,
  }
}

export default GameServiceOnline;