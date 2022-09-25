import React, { useEffect, useState } from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Text from '../components/AppText'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialTopTabNavigator();

type CardStatsProps = {
  icon: string,
  value: number,
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
      <Text style={{fontSize: 25, position: 'absolute', right: 20, top:15,}}>{props.value}</Text>
      <Text style={{fontSize: 16, marginTop: 15,}}>{props.text}</Text>
    </View>
  );
}

type TabLevelStatsProps = {
  gameLevel: number
}

const TabLevelStats: React.FC<TabLevelStatsProps> = props => {

  const theme = useTheme();
  const styles = makeStyles(theme.colors)

  return (
    <View style={styles.container}>
    <ScrollView contentContainerStyle={{marginHorizontal: 20,}}>
      <Text style={styles.sectionTitle}>Partite</Text>
      <CardStats value={0} icon={'grid'} text={'Partite iniziate'} />
      <CardStats value={0} icon={'trophy-outline'} text={'Partite vinte'} />
      <CardStats value={0} icon={'flag-outline'} text={'Percentuale di vincita'} />

      <Text style={styles.sectionTitle}>Tempo</Text>
      <CardStats value={0} icon={'timer-outline'} text={'Miglior tempo'} />
      <CardStats value={0} icon={'timeline-clock-outline'} text={'Tempo medio'} />

      <Text style={styles.sectionTitle}>Punteggio</Text>
      <CardStats value={0} icon={'star-check-outline'} text={'Punteggio migliore'} />
      <CardStats value={0} icon={'progress-star'} text={'Punteggio medio'} />

      <Text style={styles.sectionTitle}>Serie</Text>
      <CardStats value={0} icon={'chevron-right'} text={'Serie vincente attuale'} />
      <CardStats value={0} icon={'chevron-double-right'} text={'Miglior serie vincente'} />

    </ScrollView>
    </View>
  );

}

const StatisticsTabScreen = ({ route }) => {

  const [timePeriod, setTimePeriod] = useState();

  useEffect(() => {

  }, [timePeriod])

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Facile"
        children={() => <TabLevelStats
          gameLevel={1} />}
      />
      <Tab.Screen
        name="Medio"
        children={() => <TabLevelStats
          gameLevel={2} />} />
      <Tab.Screen
        name="Difficile"
        children={() => <TabLevelStats
          gameLevel={3} />} />
      <Tab.Screen
        name="Online"
        children={() => <TabLevelStats
          gameLevel={-1} />} />
    </Tab.Navigator>
  )
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

export default StatisticsTabScreen;

