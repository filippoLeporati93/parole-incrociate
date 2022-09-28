import { IPlayMatrix } from "../services/GameServiceFactory"

export type gameResults = {
    isOpponent: boolean,
    points: number,
    words: wordResults[],
    matrix: IPlayMatrix
}

export type wordResults = {
    word: string,
    direction: string, 
    location: number[]
}

export type statistics = {
    games: game[],

}

export type statisticsKpi = {
    gamePlayed: number,
    gameWon: number,
    percGameWon: number,
    bestTime: number,
    avgTime: number,
    bestScore: number,
    avgScore: number,
    winningSeries: number,
    bestWinningSeries: number,
}

export type game = {
    level: number,
    gameDatetime: Date,
    youWon: boolean,
    score: number,
    gameElapsedTime: number,
}

