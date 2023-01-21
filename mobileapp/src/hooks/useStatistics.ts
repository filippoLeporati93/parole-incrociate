import {useCallback, useEffect, useState} from 'react';
import {statisticsKpi} from '../models/Types';
import StatisticsUtils from '../utils/StatisticsUtils';

export const useStatistics = (
  timeFilterCode: string,
  gameLevel: number
): [statisticsKpi, boolean, () => void, () => void] => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [statistics, setStatistics] = useState<statisticsKpi>({
    gamePlayed: 0,
    gameWon: 0,
    percGameWon: 0,
    bestTime: 0,
    avgTime: 0,
    bestScore: 0,
    avgScore: 0,
    winningSeries: 0,
    bestWinningSeries: 0,
  });

  const refresh = useCallback(() => {
    setIsRefreshing(true);
  }, []);

  const reset = useCallback(() => {
    setIsRefreshing(true);
    StatisticsUtils.resetStatistics(gameLevel);
  }, [gameLevel]);

  useEffect(() => {
    StatisticsUtils.calcKpis(timeFilterCode, gameLevel).then(s => {
      setStatistics(s);
      setIsRefreshing(false);
    });
  }, [isRefreshing, timeFilterCode, gameLevel]);

  return [statistics, isRefreshing, refresh, reset];
};
