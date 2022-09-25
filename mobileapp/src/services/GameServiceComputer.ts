import FetchWrapper from '../api/FetchWrapper';
import { IPlayMatrix } from './GameServiceFactory';

const GameServiceComputer = () => {
  
  const updateGame = (
    cellIndexPressed: {dx:number,dy:number},
    letter: string,
    onGameUpdate:(opponentLetter:string, isOpponentGridCompleted: boolean) => void) => {
    const body = { 
      letter: {
        value: letter, 
        location: cellIndexPressed
      } 
    };
    return FetchWrapper.post("computegrid", body)
      .then(value => {console.log(value); onGameUpdate(value.letter.value, value.isGridCompleted)});
  }

  const joinGameRoom = (roomId: string) => {}

  const onStartGame = (callback: (options: any) => void) => {
    FetchWrapper.post("resetgame", {}).then(callback);
  }

  const gameFinish = (matrix: IPlayMatrix, onGameFinish: (results: any[]) => void) => {
    const bodyPlayer = {
      grid: matrix
    }
    const results = [];
    results.push(FetchWrapper.post("results", bodyPlayer));
    results.push(FetchWrapper.post("results?opponent=true", {}));
    FetchWrapper.allSettled(results).then(onGameFinish);
  }

  return {
    joinGameRoom,
    updateGame,
    onStartGame,
    gameFinish,
  }
}

export default GameServiceComputer;