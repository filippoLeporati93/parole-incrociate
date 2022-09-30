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
import SocketService   from "./services/SocketService";
import Config from 'react-native-config';

const BASE_WS_URL = Config.BASE_WS_URL;

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
      primary: '#bbdefb',
      primaryLight: '#eeffff',
      primaryDark: '#036595',
      backgroundGray: '#8aacc8'
    },
  };

  const navigationRef = useNavigationContainerRef();

  const theme = CustomDefaultTheme;

  const [isOffline, setOfflineStatus] = useState(false);

  const connectSocket = () => {
    SocketService
      .connect(BASE_WS_URL)
      .catch((err) => {
        console.error("Error: ", err);
      });
  };

  useEffect(() => {
    connectSocket();
  }, []);


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
