import React from 'react';

import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import Text from './AppText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatTime} from './Timer';
import {useStatistics} from '../hooks';

type CardStatsProps = {
  icon: string;
  value: string | number;
  text: string;
};

const CardStats: React.FC<CardStatsProps> = props => {
  const theme = useTheme();

  return (
    <View
      style={{
        padding: 15,
        borderRadius: 10,
        backgroundColor: theme.colors.primaryLight,
        marginVertical: 10,
      }}
    >
      <Icon name={props.icon} size={30} color={theme.colors.primaryDark} />
      <Text style={{fontSize: 25, position: 'absolute', right: 20, top: 15}}>
        {props.value}
      </Text>
      <Text style={{fontSize: 16, marginTop: 15}}>{props.text}</Text>
    </View>
  );
};

type TabLevelStatsProps = {
  gameLevel: number;
  timeFilterCode: string;
};

const TabLevelStats: React.FC<TabLevelStatsProps> = props => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const [statistics, isRefreshing, refresh, reset] = useStatistics(
    props.timeFilterCode,
    props.gameLevel
  );

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{marginHorizontal: 20}}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
      }
    >
      <Text style={styles.sectionTitle}>Partite</Text>
      <CardStats
        value={statistics.gamePlayed}
        icon={'grid'}
        text={'Partite iniziate'}
      />
      <CardStats
        value={statistics.gameWon}
        icon={'trophy-outline'}
        text={'Partite vinte'}
      />
      <CardStats
        value={(statistics.percGameWon * 100).toFixed(0) + '%'}
        icon={'flag-outline'}
        text={'Percentuale di vincita'}
      />

      <Text style={styles.sectionTitle}>Tempo</Text>
      <CardStats
        value={formatTime(statistics.bestTime)}
        icon={'timer-outline'}
        text={'Miglior tempo vincente'}
      />
      <CardStats
        value={formatTime(statistics.avgTime)}
        icon={'timeline-clock-outline'}
        text={'Tempo medio'}
      />

      <Text style={styles.sectionTitle}>Punteggio</Text>
      <CardStats
        value={statistics.bestScore}
        icon={'star-check-outline'}
        text={'Punteggio migliore'}
      />
      <CardStats
        value={statistics.avgScore}
        icon={'progress-star'}
        text={'Punteggio medio'}
      />

      <Text style={styles.sectionTitle}>Serie</Text>
      <CardStats
        value={statistics.winningSeries}
        icon={'chevron-right'}
        text={'Serie vincente attuale'}
      />
      <CardStats
        value={statistics.bestWinningSeries}
        icon={'chevron-double-right'}
        text={'Miglior serie vincente'}
      />

      <Pressable style={styles.commandButton} onPress={reset}>
        <Text style={styles.panelButtonTitle}>Cancella statistiche</Text>
      </Pressable>
    </ScrollView>
  );
};

const makeStyles = colors =>
  StyleSheet.create({
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
    commandButton: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.primaryDark,
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 10,
    },
    panelButtonTitle: {
      fontSize: 13,
      color: 'white',
    },
  });

export default TabLevelStats;
