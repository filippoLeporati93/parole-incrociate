import FetchWrapper from '../api/FetchWrapper';
import { IPlayMatrix } from './GameServiceFactory';

const GameServiceComputer = () => {

  let myTurn = true;
  
  const updateGame = (
    level: number,
    letter: string,
    onGameUpdate:(opponentLetter:string) => void
    ) => {
    myTurn = false;
    const body = { 
      letter: {
        value: letter, 
      },
      level: level,
    };
    return FetchWrapper.post("computegrid", body)
      .then(value => { myTurn = true; onGameUpdate(value.letter.value)})
      .catch(err => console.error(err));
  }

  const joinGameRoom = (roomId?: string): Promise<boolean> => {return new Promise((rs,rj) => rs(true));}

  const onStartGame = ( callback: (roomId?: number, nextPlayerSocketId?: string) => void) => {
    FetchWrapper.post("resetgame", {}).then(callback).catch(err => console.error(err));
  }

  const gameFinish = (matrix: IPlayMatrix, onGameFinish: (results: any[]) => void) => {
    myTurn = false;
    const bodyPlayer = {
      grid: matrix
    }
    const results = [];
    results.push(FetchWrapper.post("results", bodyPlayer));
    results.push(FetchWrapper.post("results?opponent=true", {}));
    FetchWrapper.allSettled(results).then(onGameFinish).catch(err => console.error(err));
  }

  const isMyTurn = () => {
    return myTurn;
  }

  return {
    joinGameRoom,
    updateGame,
    onStartGame,
    gameFinish,
    isMyTurn
  }
}

export default GameServiceComputer;