import {gameResults} from '../models/Types';
import GameEngine, {Matrix} from './GameEngine';

const GameServiceComputer = (level: number, wordlist: string[]) => {

  let opponentMatrix: Matrix = [];
  let updateGameLetter: string = '';
  const ge = GameEngine(wordlist);

  function updateGame(letter: string, cb?: () => void, roomId?: string) {
    updateGameLetter = letter;
    cb && cb();
  }

  function onUpdateGame(cb: (opponentLetter: string) => void) {
    const [next_grid, next_letter, next_grid_completed] = ge.computeNextGrid(
      opponentMatrix,
      level,
      updateGameLetter,
    );
    opponentMatrix = next_grid;
    cb && cb(next_letter.value);
  }

  function joinGameRoom(roomId?: string): Promise<boolean> {
    return new Promise((rs, rj) => rs(true));
  }

  function onStartGame(cb: (start: boolean, roomId?: string) => void) {
    opponentMatrix = ge.generateEmptyMatrix();
    cb && cb(true);
  }

  function gameFinish(
    matrix: Matrix,
    cb: (myResult: gameResults) => void,
    roomId?: string
  ) {
    const results = {
      ...ge.calculateResults(matrix),
      matrix: matrix,
      isOpponent: false,
    };
    cb(results);
  }

  function onGameFinish(cb: (opponentResults: gameResults) => void) {
    const results = {
      ...ge.calculateResults(opponentMatrix),
      matrix: opponentMatrix,
      isOpponent: true,
    };
    cb(results);
  }

  function onPlayerLeaving(cb: (playersRemaining?: number) => void) {
    cb();
  }

  function leaveGameRoom() {
    return;
  }

  return {
    updateGame,
    onUpdateGame,
    onStartGame,
    gameFinish,
    onGameFinish,
    onPlayerLeaving,
    leaveGameRoom,
  };
};

export default GameServiceComputer;
