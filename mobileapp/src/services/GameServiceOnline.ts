import FetchWrapper from '../api/FetchWrapper';
import {gameResults} from '../models/Types';
import {IPlayMatrix} from './GameServiceFactory';
import SocketService from './SocketService';

const GameServiceOnline = () => {
  function joinGameRoom(
    roomId: string,
    requesterUserID: string,
    requesterUsername: string,
    receiverUserID: string
  ) {
    const socket = SocketService.socket;
    if (socket) {
      socket.emit('join_room', {
        roomId,
        requesterUserID,
        requesterUsername,
        receiverUserID,
      });
    }
  }

  function onJoinGameRoom(
    cb: (
      roomId: string,
      requesterUserID: string,
      requesterUsername: string
    ) => void
  ) {
    const socket = SocketService.socket;
    if (socket) {
      const listener = ({
        roomId,
        requesterUserID,
        requesterUsername,
      }: {
        roomId: string;
        requesterUserID: string;
        requesterUsername: string;
      }) => {
        cb(roomId, requesterUserID, requesterUsername);
      };
      socket.on('join_room', listener);
      return () => socket && socket.off('join_room', listener);
    }
    return () => {};
  }

  function roomJoined(
    roomId: string,
    responseUserID: string,
    accepted: boolean
  ) {
    const socket = SocketService.socket;
    if (socket) {
      socket.emit('room_joined', {roomId, responseUserID, accepted});
    }
  }

  function onRoomJoined(
    cb: (roomId: string, responseUserID: string, accepted: boolean) => void
  ) {
    const socket = SocketService.socket;
    if (socket) {
      const listener = ({
        roomId,
        responseUserID,
        accepted,
      }: {
        roomId: string;
        responseUserID: string;
        accepted: boolean;
      }) => cb(roomId, responseUserID, accepted);
      socket.on('room_joined', listener);
      return () => socket && socket.off('room_joined', listener);
    }
    return () => {};
  }

  function updateGame(
    level: number,
    letter: string,
    cb?: () => void,
    roomId?: string
  ) {
    const socket = SocketService.socket;
    if (socket) {
      socket.emit('update_game', {letter: {value: letter}, roomId});
    }
  }

  function onUpdateGame(cb: (opponentLetter: string) => void) {
    const socket = SocketService.socket;
    if (socket) {
      const listener = ({opponentLetter}: {opponentLetter: string}) =>
        cb(opponentLetter);
      socket.on('on_update_game', listener);
      return () => socket && socket.off('on_update_game', listener);
    }
    return () => {};
  }

  function startGame(roomId: string) {
    const socket = SocketService.socket;
    if (socket) {
      socket.emit('start_game', {roomId});
    }
  }

  function onStartGame(cb: (firstPlayer: boolean, roomId?: string) => void) {
    const socket = SocketService.socket;
    if (socket) {
      const listener = ({
        firstPlayer,
        roomId,
      }: {
        firstPlayer: boolean;
        roomId?: string;
      }) => {
        cb(firstPlayer, roomId);
      };
      socket.on('start_game', listener);
      return () => socket && socket.off('start_game', listener);
    }
    return () => {};
  }

  async function gameFinish(
    matrix: IPlayMatrix,
    cb: (myResult: gameResults) => void,
    roomId?: string
  ) {
    const socket = SocketService.socket;
    if (socket) {
      socket.emit('game_finish', {matrix, roomId});
      FetchWrapper.post('results?opponent=false', {grid: matrix})
        .then(cb)
        .catch(e => console.error(e));
    }
  }

  function onGameFinish(cb: (opponentResult: gameResults) => void) {
    const socket = SocketService.socket;
    if (socket) {
      const listener = ({opponentMatrix}: {opponentMatrix: any}) => {
        FetchWrapper.post('results?opponent=true', {grid: opponentMatrix})
          .then(cb)
          .catch(err => console.error(err));
      };
      socket.on('on_game_finish', listener);
      return () => socket && socket.off('on_game_finish', listener);
    }
    return () => {};
  }

  function onPlayerLeaving(cb: (userID: string) => void) {
    const socket = SocketService.socket;
    if (socket) {
      const listener = (userID: string) => {
        cb(userID);
      };
      socket.on('user_disconnected', listener);
      return () => socket && socket.off('user_disconnected', listener);
    }
    return () => {};
  }

  return {
    joinGameRoom,
    onJoinGameRoom,
    roomJoined,
    onRoomJoined,
    updateGame,
    onUpdateGame,
    startGame,
    onStartGame,
    gameFinish,
    onGameFinish,
    onPlayerLeaving,
  };
};

export default GameServiceOnline;
