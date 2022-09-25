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

