import React from 'react';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';
import Text from '../components/AppText';
import HomeScreen from './HomeTabScreen';

import {useTheme} from 'react-native-paper';
import StatisticsTabScreen from './StatisticsTabScreen';
import BoardScreen from './BoardScreen';

const HomeStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
  <Tab.Navigator
    initialRouteName="HomeTab"
    activeColor="#a5192f"
    barStyle={{backgroundColor: 'white'}}
    shifting={false}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeStackScreen}
      options={{
        tabBarLabel: <Text>Home</Text>,
        tabBarIcon: ({color}) => <Icon name="home" color={color} size={20} />,
      }}
    />
    <Tab.Screen
      name="StatisticsTab"
      component={StatisticsTabScreen}
      options={{
        tabBarLabel: <Text>Statistiche</Text>,
        tabBarIcon: ({color}) => (
          <Icon name="stats" color={color} size={20} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default MainTabScreen;

const HomeStackScreen = ({}: any) => {
  const {colors} = useTheme();
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: colors.background, // iOS
          elevation: 0, // Android
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: 'AirbnbCereal_W_Md',
        },
      }}
    >
      <HomeStack.Screen
        name="HomeStack"
        component={HomeScreen}
        options={{
          headerLeft: () => (<Text style={{marginStart: 15, color: colors.text, fontSize: 20}}>Spots</Text>),
          headerTitle: "",
        }}
      />
      <HomeStack.Screen
        name="BoardStack"
        component={BoardScreen}
        options={{
          headerLeft: () => (<Text style={{marginStart: 15, color: colors.text, fontSize: 20}}>Spots</Text>),
          headerTitle: "",
        }}
      />
    </HomeStack.Navigator>
  );
};