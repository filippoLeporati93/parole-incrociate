import React, { useCallback, useEffect, useState } from 'react';

import { ScrollView } from 'react-native-gesture-handler';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Text from './AppText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StatisticsUtils from '../utils/StatisticsUtils';
import { statisticsKpi } from '../models/Types';
import { useFocusEffect } from '@react-navigation/native';
import { formatTime } from './Timer';

type CardStatsProps = {
  icon: string,
  value: string | number,
  text: string,
}

const CardStats: React.FC<CardStatsProps> = props => {
  const theme = useTheme();

  return (
    <View style={{
      padding: 15,
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
      marginVertical: 10,
    }}>
      <Icon name={props.icon} size={30} color={theme.colors.primaryDark} />
      <Text style={{ fontSize: 25, position: 'absolute', right: 20, top: 15, }}>{props.value}</Text>
      <Text style={{ fontSize: 16, marginTop: 15, }}>{props.text}</Text>
    </View>
  );
}

type TabLevelStatsProps = {
  gameLevel: number,
  time: number,
}

const TabLevelStats: React.FC<TabLevelStatsProps> = props => {

  const theme = useTheme();
  const styles = makeStyles(theme.colors)

  const [stats, setStats] = useState<statisticsKpi>({
    gamePlayed: 0,
    gameWon: 0,
    percGameWon: 0,
    bestTime: 0,
    avgTime: 0,
    bestScore: 0,
    avgScore: 0,
    winningSeries: 0,
    bestWinningSeries: 0
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    StatisticsUtils.calcKpis(props.time, props.gameLevel)
      .then(s => { setStats(s); setRefreshing(false)})
  }, [refreshing]);

  return (
    <View style={styles.container}>
      <ScrollView 
      contentContainerStyle={{ marginHorizontal: 20, }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      >
        <Text style={styles.sectionTitle}>Partite</Text>
        <CardStats value={stats.gamePlayed} icon={'grid'} text={'Partite iniziate'} />
        <CardStats value={stats.gameWon} icon={'trophy-outline'} text={'Partite vinte'} />
        <CardStats value={(stats.percGameWon * 100).toFixed(0) + "%"} icon={'flag-outline'} text={'Percentuale di vincita'} />

        <Text style={styles.sectionTitle}>Tempo</Text>
        <CardStats value={formatTime(stats.bestTime)} icon={'timer-outline'} text={'Miglior tempo vincente'} />
        <CardStats value={formatTime(stats.avgTime)} icon={'timeline-clock-outline'} text={'Tempo medio'} />

        <Text style={styles.sectionTitle}>Punteggio</Text>
        <CardStats value={stats.bestScore} icon={'star-check-outline'} text={'Punteggio migliore'} />
        <CardStats value={stats.avgScore} icon={'progress-star'} text={'Punteggio medio'} />

        <Text style={styles.sectionTitle}>Serie</Text>
        <CardStats value={stats.winningSeries} icon={'chevron-right'} text={'Serie vincente attuale'} />
        <CardStats value={stats.bestWinningSeries} icon={'chevron-double-right'} text={'Miglior serie vincente'} />

      </ScrollView>
    </View>
  );

}

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 25,
    marginTop: 10,
  },
  boardContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  pointsContainer: {
    marginTop: 10,
  },


});

export default TabLevelStats;