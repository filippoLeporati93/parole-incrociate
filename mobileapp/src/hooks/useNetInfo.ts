import { useEffect, useState } from "react";
import NetInfo from '@react-native-community/netinfo';

export const useNetInfo = () => {
  const [isOffline, setOfflineStatus] = useState(false);
  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      const offline = !(state.isConnected && state.isInternetReachable === null
        ? true
        : state.isInternetReachable);
      if (!isOffline && offline) {
        setOfflineStatus(offline);
      }
    });

    return () => {
      removeNetInfoSubscription();
    };
  }, []);

  return [isOffline];

};