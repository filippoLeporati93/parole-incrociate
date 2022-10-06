import FetchWrapper from "../api/FetchWrapper";
import { gameResults } from "../models/Types";
import { IPlayMatrix } from "./GameServiceFactory";
import SocketService from "./SocketService";


const GameServiceOnline = () => {

  let opponentResults: gameResults | null = null;
  let nextPlyrSocketId: string | null = null;
  let joinedRoomId: string | null = null;
  
  async function joinGameRoom(roomId?: string): Promise<boolean> {
    const socket = SocketService.socket;
    if(socket) {
      return new Promise((rs, rj) => {
        socket.emit("join_game", { roomId: roomId ?? socket.id });
        socket.on("room_joined", ({status}) => rs(status));
        socket.on("room_join_error", ({ error }) => rj(error));
      });
    } else {
      return new Promise((rs,rj) => rj("Error: socket undefined"))
    }
  }

  async function updateGame(
     level: number,
     letter: string,
     onGameUpdate:(opponentLetter: string) => void) 
  {
    const socket = SocketService.socket;
    if(socket) {
      socket.emit("update_game", { letter: {value: letter},});
      socket.on("on_game_update", ({ opponentLetter }) => onGameUpdate(opponentLetter));
    }
  }


  function onStartGame(cb: () => {}) {
    const socket = SocketService.socket;
    if(socket)
      socket.on("start_game", ({roomId, nextPlayerSocketId}) => {
        joinedRoomId = roomId;
        nextPlyrSocketId = nextPlayerSocketId;
        cb();
      });
  }

  async function gameFinish(matrix: IPlayMatrix, cb: (myResult: gameResults) => void) {
    nextPlyrSocketId = null;
    const socket = SocketService.socket;
    if(socket) {
      socket.emit("game_finish", { matrix });
      FetchWrapper.post("results?opponent=false", {grid: matrix})
      .then(cb)
      .catch(e => console.error(e))
    }
  }

  async function onGameFinish(cb: (opponentResult: gameResults) => void) {
    const socket = SocketService.socket;
    if(socket) {
      socket.on("on_game_finish", ({ opponentMatrix }) => {
        FetchWrapper.post("results?opponent=true", {grid: opponentMatrix})
        .then(cb)
        .catch(err => console.error(err));
      });
    }
  }


  function isMyTurn() {
    const socket = SocketService.socket;
    if(socket) {
      return nextPlyrSocketId === socket.id;
    }
  }


  return {
    joinGameRoom,
     updateGame,
     onStartGame,
     gameFinish,
     onGameFinish,
     isMyTurn,
  }
}

export default GameServiceOnline;