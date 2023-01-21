import React, {useEffect, useState} from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TabLevelStats from '../components/TabLevelStats';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'react-native-paper';
import StatisticsTimeFilterModal from '../components/modal/StatisticsTimeFilterModal';

const Tab = createMaterialTopTabNavigator();

const StatisticsTabScreen = ({route, navigation}) => {
  const theme = useTheme();

  const [timeFilterCode, setTimeFilterCode] = useState<string>('ALL');
  const [showTimeFilterModal, setShowTimeFilterModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{marginRight: 15}}
            onPress={() => setShowTimeFilterModal(true)}
          >
            <Icon name="tune-variant" size={25} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, theme.colors.text]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatisticsTimeFilterModal
        isVisible={showTimeFilterModal}
        timeFilterCodeSelected={timeFilterCode}
        onTimePress={timeFilterCode => {
          setTimeFilterCode(timeFilterCode);
          setShowTimeFilterModal(false);
        }}
        onBackPress={() => setShowTimeFilterModal(false)}
      />
      <Tab.Navigator>
        <Tab.Screen
          name="StatisticsTabLevel1"
          children={() => (
            <TabLevelStats gameLevel={1} timeFilterCode={timeFilterCode} />
          )}
          options={{title: 'Facile'}}
        />
        <Tab.Screen
          name="StatisticsTabLevel2"
          children={() => (
            <TabLevelStats gameLevel={2} timeFilterCode={timeFilterCode} />
          )}
          options={{title: 'Medio'}}
        />
        <Tab.Screen
          name="StatisticsTabLevel3"
          children={() => (
            <TabLevelStats gameLevel={3} timeFilterCode={timeFilterCode} />
          )}
          options={{title: 'Difficile'}}
        />
        <Tab.Screen
          name="StatisticsTabLevelOnline"
          children={() => (
            <TabLevelStats gameLevel={-1} timeFilterCode={timeFilterCode} />
          )}
          options={{title: 'Online'}}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default StatisticsTabScreen;
