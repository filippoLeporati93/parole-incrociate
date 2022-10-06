import React from 'react';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';
import Text from '../components/AppText';
import HomeScreen from './HomeTabScreen';

import {useTheme} from 'react-native-paper';
import StatisticsTabScreen from './StatisticsTabScreen';
import BoardScreen from './BoardScreen';
import ScoreScreen from './ScoreScreen';
import HowToPlayScreen from './HowToPlayScreen';
import JoinRoomScreen from './JoinRoomScreen';

const HomeStack = createStackNavigator();
const StatisticsStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
  <Tab.Navigator
    initialRouteName="HomeTab"
    activeColor="#036595"
    barStyle={{backgroundColor: 'white'}}
    shifting={false}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeStackScreen}
      options={{
        tabBarLabel: <Text style={{color:'gray'}}>Home</Text>,
        tabBarIcon: ({color}) => <Icon name="home" color={color} size={20} />,
      }}
    />
    <Tab.Screen
      name="StatisticsTab"
      component={StatisticsStackScreen}
      options={{
        tabBarLabel: <Text style={{color:'gray'}}>Statistiche</Text>,
        tabBarIcon: ({color}) => (
          <Icon name="stats-chart" color={color} size={20} />
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
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerTitle: "",
        }}
      />
      <HomeStack.Screen
        name="JoinRoomScreen"
        component={JoinRoomScreen}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (<Text style={{color: colors.text, fontSize: 20}}>Parole Incrociate</Text>),
          headerTitleAlign: 'center'
        }}
      />
      <HomeStack.Screen
        name="BoardScreen"
        component={BoardScreen}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (<Text style={{color: colors.text, fontSize: 20}}>Parole Incrociate</Text>),
          headerTitleAlign: 'center'
        }}
      />
      <HomeStack.Screen
        name="ScoreScreen"
        component={ScoreScreen}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (<Text style={{color: colors.text, fontSize: 20}}>Dettagli</Text>),
          headerTitleAlign: 'center'
        }}
      />
      <HomeStack.Screen
        name="HowToPlayScreen"
        component={HowToPlayScreen}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (<Text style={{marginStart: 15, color: colors.text, fontSize: 20}}></Text>),
        }}
      />
    </HomeStack.Navigator>
  );
};

const StatisticsStackScreen = ({}: any) => {
  const {colors} = useTheme();
  return (
    <StatisticsStack.Navigator
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
      <StatisticsStack.Screen
        name="StatisticsTabScreen"
        component={StatisticsTabScreen}
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
    </StatisticsStack.Navigator>
  );
};