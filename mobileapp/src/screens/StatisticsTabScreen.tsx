import React, { useEffect, useState } from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TabLevelStats from '../components/TabLevelStats';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import StatisticsTimeFilterModal from '../components/modal/StatisticsTimeFilterModal';

const Tab = createMaterialTopTabNavigator();


const StatisticsTabScreen = ({ route, navigation }) => {
  const theme = useTheme();

  const [timeFilterCode, setTimeFilterCode] = useState<string>('DAY');
  const [showTimeFilterModal, setShowTimeFilterModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={{ marginRight: 15 }} onPress={() => setShowTimeFilterModal(true)}>
            <Icon name="tune-variant" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <>
      <StatisticsTimeFilterModal
        isVisible={showTimeFilterModal}
        timeFilterCodeSelected={timeFilterCode}
        onTimePress={(timeFilterCode) => { 
          setTimeFilterCode(timeFilterCode); 
          setShowTimeFilterModal(false) 
        }}
        onBackPress={() => setShowTimeFilterModal(false)} />
      <Tab.Navigator>

        <Tab.Screen
          name="Facile"
          children={() => <TabLevelStats
            gameLevel={1}
            timeFilterCode={timeFilterCode} />}
        />
        <Tab.Screen
          name="Medio"
          children={() => <TabLevelStats
            gameLevel={2}
            timeFilterCode={timeFilterCode} />} />
        <Tab.Screen
          name="Difficile"
          children={() => <TabLevelStats
            gameLevel={3}
            timeFilterCode={timeFilterCode} />} />
        <Tab.Screen
          name="Online"
          children={() => <TabLevelStats
            gameLevel={-1}
            timeFilterCode={timeFilterCode} />} />
      </Tab.Navigator>
    </>
  )
}


export default StatisticsTabScreen;

