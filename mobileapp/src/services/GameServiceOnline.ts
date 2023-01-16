import {gameResults} from '../models/Types';
import GameEngine, {Matrix} from './GameEngine';
import SocketService from './SocketService';

const GameServiceOnline = (wordlist: string[]) => {
  const ge = GameEngine(wordlist);

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
    cb: (
      roomId: string,
      responseUserID: string,
      accepted: boolean,
      reason: string
    ) => void
  ) {
    const socket = SocketService.socket;
    if (socket) {
      const listener = ({
        roomId,
        responseUserID,
        accepted,
        reason,
      }: {
        roomId: string;
        responseUserID: string;
        accepted: boolean;
        reason: string;
      }) => cb(roomId, responseUserID, accepted, reason);
      socket.on('room_joined', listener);
      return () => socket && socket.off('room_joined', listener);
    }
    return () => {};
  }

  function updateGame(letter: string, cb?: () => void, roomId?: string) {
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

  function startGame(roomId: string, roomUsers: string[]) {
    const socket = SocketService.socket;
    if (socket) {
      socket.emit('start_game', {roomId, roomUsers});
    }
  }

  function onStartGame(
    cb: (firstPlayer: boolean, roomId?: string, roomUsers?: string[]) => void
  ) {
    const socket = SocketService.socket;
    if (socket) {
      const listener = ({
        firstPlayer,
        roomId,
        roomUsers,
      }: {
        firstPlayer: boolean;
        roomId?: string;
        roomUsers?: string[];
      }) => {
        cb(firstPlayer, roomId, roomUsers);
      };
      socket.on('start_game', listener);
      return () => socket && socket.off('start_game', listener);
    }
    return () => {};
  }

  async function gameFinish(
    matrix: Matrix,
    cb: (myResult: gameResults) => void,
    roomId?: string
  ) {
    const socket = SocketService.socket;
    if (socket) {
      socket.emit('game_finish', {matrix, roomId});
      const results = {
        ...ge.calculateResults(matrix),
        matrix: matrix,
        isOpponent: false,
      };
      cb(results);
    }
  }

  function onGameFinish(cb: (opponentResult: gameResults) => void) {
    const socket = SocketService.socket;
    if (socket) {
      const listener = ({opponentMatrix}: {opponentMatrix: any}) => {
        const results = {
          ...ge.calculateResults(opponentMatrix),
          matrix: opponentMatrix,
          isOpponent: true,
        };
        cb(results);
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

  function leaveGameRoom() {
    const socket = SocketService.socket;
    if (socket) {
      socket.emit('leave_game_room');
    }
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
    leaveGameRoom,
  };
};

export default GameServiceOnline;
