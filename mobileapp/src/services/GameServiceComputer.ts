import FetchWrapper from '../api/FetchWrapper';
import { gameResults } from '../models/Types';
import { IPlayMatrix } from './GameServiceFactory';

const GameServiceComputer = () => {

  let myTurn = true;
  
  const updateGame = (
    level: number,
    letter: string,
    onGameUpdate:(opponentLetter:string) => void
    ) => {
    const body = { 
      letter: {
        value: letter, 
      },
      level: level,
    };
    return FetchWrapper.post("computegrid", body)
      .then(value => { 
        myTurn = true; 
        onGameUpdate(value.letter.value)
      })
      .catch(err => console.error(err));
  }

  const joinGameRoom = (roomId?: string): Promise<boolean> => {return new Promise((rs,rj) => rs(true));}

  const onStartGame = (cb: () => void) => {
    FetchWrapper.post("resetgame", {}).then(cb).catch(err => console.error(err));
  }

  const gameFinish = (matrix: IPlayMatrix, cb: (myResult: gameResults) => void) => {
    FetchWrapper.post("results?opponent=false", {grid: matrix})
    .then(cb)
    .catch(err => console.error(err));
  }

  const isMyTurn = () => {
    return myTurn;
  }

  async function onGameFinish(cb: (opponentResults: gameResults) => void) {
    FetchWrapper.post("results?opponent=true", {})
    .then(cb)
    .catch(e => console.error(e))
  }

  return {
    joinGameRoom,
    updateGame,
    onStartGame,
    gameFinish,
    isMyTurn,
    onGameFinish,
  }
}

export default GameServiceComputer;