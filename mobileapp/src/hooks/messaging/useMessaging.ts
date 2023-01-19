import {useEffect} from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useUserPref} from '../useUserPref';

export const useMessaging = (onNotificationOpenedApp?: () => void) => {
  const [, userPref] = useUserPref();

  useEffect(() => {
    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // When the application is running, but in the background.
    messaging().onNotificationOpenedApp(() => {
      if (!userPref.isNotificationEnabled) {
        return;
      }
      onNotificationOpenedApp && onNotificationOpenedApp();
    });

    // Check whether an initial notification is available
    // When the application is opened from a quit state.
    messaging()
      .getInitialNotification()
      .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
        if (!userPref.isNotificationEnabled) {
          return;
        }
        if (remoteMessage) {
          onNotificationOpenedApp && onNotificationOpenedApp();
        }
      });
  }, [onNotificationOpenedApp, userPref.isNotificationEnabled]);

  return null;
};
