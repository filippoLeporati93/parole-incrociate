import FetchWrapper from '../api/FetchWrapper';
import { gameResults } from '../models/Types';
import { IPlayMatrix } from './GameServiceFactory';

const GameServiceComputer = () => {

  const updateGame = (level: number, letter: string, cb?: () => void ) => {
      const body = { 
        letter: {
          value: letter, 
        },
        level: level,
      };
      return FetchWrapper.post("nextturn", body)
      .then(cb)
      .catch(err => console.error(err));
  }

  const onUpdateGame = (cb: (opponentLetter:string) => void) => {
    return FetchWrapper.post("computegrid", {})
      .then(value => { 
        cb(value.letter.value)
      })
      .catch(err => console.error(err));
  }

  const joinGameRoom = (roomId?: string): Promise<boolean> => {return new Promise((rs,rj) => rs(true));}

  const onStartGame = (cb: (start: boolean, roomId?: string) => void) => {
    FetchWrapper.post("resetgame", {})
    .then(() => cb(true))
    .catch(err => console.error(err));
  }

  const gameFinish = (matrix: IPlayMatrix, cb: (myResult: gameResults) => void) => {
    FetchWrapper.post("results?opponent=false", {grid: matrix})
    .then(cb)
    .catch(err => console.error(err));
  }


  async function onGameFinish(cb: (opponentResults: gameResults) => void) {
    FetchWrapper.post("results?opponent=true", {})
    .then(cb)
    .catch(e => console.error(e))
  }

  function onPlayerLeaving(cb: (playersRemaining?: number) => void) {
    cb();
  }


  return {
    joinGameRoom,
    updateGame,
    onUpdateGame,
    onStartGame,
    gameFinish,
    onGameFinish,
    onPlayerLeaving
  }
}

export default GameServiceComputer;