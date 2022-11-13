import FetchWrapper from "../api/FetchWrapper";
import { gameResults } from "../models/Types";
import { IPlayMatrix } from "./GameServiceFactory";
import SocketService from "./SocketService";


const GameServiceOnline = () => {
  
  async function joinGameRoom(roomId?: string): Promise<boolean> {
    const socket = SocketService.socket;
    if(socket) {
      return new Promise((rs, rj) => {
        socket.emit("join_game", {});
        socket.on("room_joined", ({status}) => rs(status));
        socket.on("room_join_error", ({ error }) => rj(error));
      });
    } else {
      return new Promise((rs,rj) => rj("Error: socket undefined"))
    }
  }

  function updateGame(level: number, letter: string, cb?: () => void)
  {
    const socket = SocketService.socket;
    if(socket) {
      socket.emit("update_game", { letter: {value: letter},});
    }
  }

  function onUpdateGame(cb: (opponentLetter: string) => void) {
    const socket = SocketService.socket;
    if(socket) {
      socket.on("on_update_game", ({opponentLetter}) => cb(opponentLetter));
    }
  }


  function onStartGame(cb: (start: boolean, roomId?: string) => void) {
    const socket = SocketService.socket;
    if(socket)
      socket.on("start_game", ({start, roomId}) => {
        cb(start, roomId);
      });
  }

  async function gameFinish(matrix: IPlayMatrix, cb: (myResult: gameResults) => void) {
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

  function onPlayerLeaving(cb: (playersRemaining?: number) => void) {
    const socket = SocketService.socket;
    if(socket) {
      socket.on("on_player_leaving", ({reason, playersRemaining}) => {
        cb(playersRemaining)
      });
    }
  }



  return {
    joinGameRoom,
     updateGame,
     onUpdateGame,
     onStartGame,
     gameFinish,
     onGameFinish,
     onPlayerLeaving,
  }
}

export default GameServiceOnline;