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
import analytics from '@react-native-firebase/analytics';
import {useMessaging} from './hooks';

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
      backgroundPrimary: '#8aacc8',
      backgroundGray: '#f5f5f5',
      backgroundHome: '#87C0CD11',
    },
  };

  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef();

  const theme = CustomDefaultTheme;

  useMessaging();

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        backgroundColor={theme.colors.primaryDark}
        barStyle="default"
      />
      <NavigationContainer
        theme={theme}
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}
      >
        <MainTabScreen />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
