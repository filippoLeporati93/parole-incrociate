import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { game, statistics, statisticsKpi } from '../models/Types';

const StatisticsUtils = {
  getStatistics,
  addGame,
  calcKpis,
  resetStatistics
};

const STATISTICS_STORAGE_KEY = '@statistics';

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

function reviver(key: any, value: any) {
  if (typeof value === "string" && dateFormat.test(value)) {
    return new Date(value);
  }

  return value;
}

async function getStatistics(): Promise<statistics> {
  const statsJson = await AsyncStorage.getItem(
    STATISTICS_STORAGE_KEY,
  );
  let pref: statistics = {
      games: []
  };
  if (statsJson != null) {
    pref = JSON.parse(statsJson, reviver);
  }
  return pref;
}

async function addGame(game: game) {
    let stats = await getStatistics();
    stats.games.push(game);
    await AsyncStorage.setItem(
        STATISTICS_STORAGE_KEY,
        JSON.stringify(stats),
    );
}

async function calcKpis(timeFilterCode: string, level: number) {
    let kpis: statisticsKpi = {
        gamePlayed: 0,
        gameWon: 0,
        percGameWon: 0,
        bestTime: 0,
        avgTime: 0,
        bestScore: 0,
        avgScore: 0,
        winningSeries: 0,
        bestWinningSeries: 0
    }
    let stats = await getStatistics();

    let stats_by_time: game[] = [];
    if(timeFilterCode === 'ALL') {
      let currentMoment = moment('1900-01-01');
      stats_by_time = stats.games.filter(e => moment(e.gameDatetime).isSameOrAfter(currentMoment))
    }else {
      let currentMoment = moment();
      stats_by_time = stats.games.filter(e => moment(e.gameDatetime).isSameOrAfter(currentMoment, timeFilterCode.toLowerCase()))
    }
    
    let stats_by_level = stats_by_time.filter(e => e.level === level);
    if (stats_by_level && stats_by_level.length > 0) {
        kpis.gamePlayed = stats_by_level.length;
        kpis.gameWon = stats_by_level.filter(e => e.youWon === true).length;
        kpis.percGameWon = kpis.gamePlayed === 0 ? 0 : kpis.gameWon / kpis.gamePlayed
        kpis.bestTime = stats_by_level.filter(e => e.youWon === true).reduce((a, b) => Math.min(a, b.gameElapsedTime), Infinity);
        kpis.bestTime = kpis.bestTime === Infinity ? 0 : kpis.bestTime;
        kpis.avgTime = Math.round(stats_by_level.length > 0 ? stats_by_level.reduce((a,b) => a + b.gameElapsedTime, 0) / stats_by_level.length : 0);
        kpis.bestScore = stats_by_level.reduce((a,b) => Math.max(a, b.score), 0);
        kpis.avgScore = Math.round(stats_by_level.length > 0 ? stats_by_level.reduce((a,b) => a + b.score, 0) / stats_by_level.length : 0);
        kpis.winningSeries = stats_by_level.sort((a,b) => b.gameDatetime.getTime() - a.gameDatetime.getTime()).findIndex(e => e.youWon === false);
        kpis.winningSeries = kpis.winningSeries === -1 ? kpis.gameWon : kpis.winningSeries;
        
        let stats_ordered = stats_by_level.sort((a,b) => b.gameDatetime.getTime() - a.gameDatetime.getTime());
        let maxWinningSeries = 0;
        while(stats_ordered.length > 0) {
            let newWinningSeriesIdx = stats_ordered.findIndex(e => e.youWon === false);
            const series = stats_ordered.splice(0, newWinningSeriesIdx === -1 ? stats_ordered.length: newWinningSeriesIdx + 1);
            maxWinningSeries = Math.max(maxWinningSeries, newWinningSeriesIdx === -1 ? series.length : series.length - 1);
        }
        kpis.bestWinningSeries = maxWinningSeries;
    }
    
    return kpis;
}

async function resetStatistics(level: number) {
  let stats = await getStatistics();
  let filteredGames = stats.games.filter(e => e.level !== level);
  stats.games = filteredGames;
  await AsyncStorage.setItem(
    STATISTICS_STORAGE_KEY,
    JSON.stringify(stats),
);
}

export default StatisticsUtils;