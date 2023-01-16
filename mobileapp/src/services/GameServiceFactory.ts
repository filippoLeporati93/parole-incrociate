import GameServiceComputer from './GameServiceComputer';
import GameServiceOnline from './GameServiceOnline';
import parole_italiane from '../assets/word_storage/parole_italiane.js';

const GameServiceFactory = (level: number) => {

  if (level === -1) {
    return GameServiceOnline(parole_italiane.wordlist);
  } else if (level >= 0) {
    return GameServiceComputer(level, parole_italiane.wordlist);
  } else {
    return null;
  }
};

export default GameServiceFactory;
