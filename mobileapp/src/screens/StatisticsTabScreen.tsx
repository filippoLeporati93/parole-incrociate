import React, { useState } from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TabLevelStats from '../components/TabLevelStats';

const Tab = createMaterialTopTabNavigator();


const StatisticsTabScreen = ({ route }) => {

  const [timePeriod, setTimePeriod] = useState(-1);
  
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Facile"
        children={() => <TabLevelStats
          gameLevel={1}
          time={timePeriod} />}
      />
      <Tab.Screen
        name="Medio"
        children={() => <TabLevelStats
          gameLevel={2}
          time={timePeriod} />} />
      <Tab.Screen
        name="Difficile"
        children={() => <TabLevelStats
          gameLevel={3}
          time={timePeriod} />} />
      <Tab.Screen
        name="Online"
        children={() => <TabLevelStats
          gameLevel={-1}
          time={timePeriod} />} />
    </Tab.Navigator>
  )
}


export default StatisticsTabScreen;

