import React from 'react';
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
import {StatusBar} from 'react-native';

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

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        backgroundColor={theme.colors.primaryDark}
        barStyle="default"
      />
      <NavigationContainer theme={theme} ref={navigationRef}>
        <MainTabScreen />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
