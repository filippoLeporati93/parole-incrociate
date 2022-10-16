import React, {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {
  NavigationContainer,
  useNavigationContainerRef,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import MainTabScreen from './screens/MainTabScreen';
import NoInternetModal from './components/modal/NoInternetModal';
import { StatusBar } from 'react-native';


const App = () => {
  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333',
      textLight: '#444',
      primary: '#87C0CD',
      primaryLight: '#BBDEFB55',
      primaryDark: '#036595',
      backgroundGray: '#8aacc8',
      backgroundHome: '#87C0CD11',
    },
  };

  const navigationRef = useNavigationContainerRef();

  const theme = CustomDefaultTheme;

  const [isOffline, setOfflineStatus] = useState(false);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      const offline = !(state.isConnected && state.isInternetReachable === null ? true : state.isInternetReachable);
      setOfflineStatus(offline);
    });

    return () => {
      removeNetInfoSubscription();
    }
  }, []);


  return (
    <PaperProvider theme={theme}>
      <StatusBar
        backgroundColor={theme.colors.primaryDark}
        barStyle="light-content"
      />
        <NavigationContainer
          theme={theme}
          ref={navigationRef}>
          <MainTabScreen />
          <NoInternetModal show={isOffline} />
        </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
