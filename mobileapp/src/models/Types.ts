import {Matrix} from '../services/GameEngine';

export type gameResults = {
  isOpponent: boolean;
  points: number;
  words: wordResults[];
  matrix: Matrix;
};

export type wordResults = {
  word: string;
  direction: string;
  location: number[];
};

export type statistics = {
  games: game[];
};

export type statisticsKpi = {
  gamePlayed: number;
  gameWon: number;
  percGameWon: number;
  bestTime: number;
  avgTime: number;
  bestScore: number;
  avgScore: number;
  winningSeries: number;
  bestWinningSeries: number;
};

export type game = {
  level: number;
  gameDatetime: Date;
  youWon: boolean;
  score: number;
  gameElapsedTime: number;
};

export type gamer = {
  userID: string;
  username: string;
  statsInfo: {
    gamePlayed: number;
    gameWon: number;
    percGameWon: number;
  };
};

export type userPrefs = {
  username: string;
};

export type socketSession = {
  sessionID: string;
  username: string;
  userID: string;
  connected: boolean;
  self?: boolean;
  statsInfo: any;
};
