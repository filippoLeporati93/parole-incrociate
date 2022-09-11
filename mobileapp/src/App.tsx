import React, {useEffect, useState, useRef} from 'react';
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
import SocketService   from "./services/SocketService"

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

  const connectSocket = async () => {
    const socket = await SocketService
      .connect("http://localhost:9000")
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
