import React from 'react';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/Ionicons';
import Text from '../components/AppText';
import HomeScreen from './HomeTabScreen';

import {ActivityIndicator, useTheme} from 'react-native-paper';
import StatisticsTabScreen from './StatisticsTabScreen';
import BoardScreen from './BoardScreen';
import ScoreScreen from './ScoreScreen';
import HowToPlayScreen from './HowToPlayScreen';
import JoinRoomScreen from './JoinRoomScreen';
import LobbyScreen from './LobbyScreen';
import PrivacyPreferencesScreen from './PrivacyPreferencesScreen';
import {useUserPref} from '../hooks';
import {SafeAreaView} from 'react-native';
import SettingsScreen from './SettingsScreen';

const MainStack = createStackNavigator();
const StatisticsStack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = ({}: any) => {
  const {colors} = useTheme();

  const [retrievedFromStorage, userPref] = useUserPref();

  return (
    <MainStack.Navigator
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
      {!retrievedFromStorage ? (
        <MainStack.Screen name="LoadingScreen" options={{headerShown: false}}>
          {props => (
            <SafeAreaView
              {...props}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 15,
              }}
            >
              <ActivityIndicator size={'large'} color={colors.primaryDark} />
            </SafeAreaView>
          )}
        </MainStack.Screen>
      ) : null}
      {userPref.isFirstOpen ? (
        <MainStack.Screen
          name="PrivacyPreferencesScreen"
          component={PrivacyPreferencesScreen}
          options={{headerShown: false}}
        />
      ) : null}
      <MainStack.Screen
        name="HomeScreen"
        component={HomeTabScreen}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
      <MainStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerBackTitleVisible: false,
          headerTitle: 'Opzioni',
        }}
      />
      <MainStack.Screen
        name="JoinRoomScreen"
        component={JoinRoomScreen}
        options={{
          headerBackTitleVisible: false,
          headerTitle: '',
        }}
      />
      <MainStack.Screen
        name="LobbyScreen"
        component={LobbyScreen}
        options={{
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name="BoardScreen"
        component={BoardScreen}
        options={{
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name="ScoreScreen"
        component={ScoreScreen}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <Text style={{color: colors.text, fontSize: 20}}>Dettagli</Text>
          ),
          headerTitleAlign: 'center',
        }}
      />
      <MainStack.Screen
        name="HowToPlayScreen"
        component={HowToPlayScreen}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <Text style={{marginStart: 15, color: colors.text, fontSize: 20}} />
          ),
        }}
      />
    </MainStack.Navigator>
  );
};

const HomeTabScreen = () => (
  <Tab.Navigator
    initialRouteName="HomeTab"
    activeColor="#036595"
    barStyle={{backgroundColor: 'white'}}
    shifting={false}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeScreen}
      options={{
        tabBarLabel: <Text style={{color: 'gray'}}>Home</Text>,
        tabBarIcon: ({color}) => <Icon name="home" color={color} size={20} />,
      }}
    />
    <Tab.Screen
      name="StatisticsTab"
      component={StatisticsStackScreen}
      options={{
        tabBarLabel: <Text style={{color: 'gray'}}>Statistiche</Text>,
        tabBarIcon: ({color}) => (
          <Icon name="stats-chart" color={color} size={20} />
        ),
      }}
    />
  </Tab.Navigator>
);

const StatisticsStackScreen = ({}: any) => {
  const {colors} = useTheme();
  return (
    <StatisticsStack.Navigator
      initialRouteName="StatisticsTabScreen"
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
          headerShown: true,
          headerTitle: 'Statistiche di gioco',
          headerBackTitleVisible: false,
        }}
      />
    </StatisticsStack.Navigator>
  );
};

export default MainTabScreen;
