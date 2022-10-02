import React, {  useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import gameService from "../services/GameServiceOnline";
import socketService from "../services/SocketService";
import Text from '../components/AppText';
import { useTheme } from "react-native-paper";
import gameServiceFactory from "../services/GameServiceFactory";


const JoinRoomScreeen = ({route, navigation}) => {

  const theme = useTheme();

  const [remainingSeconds, setRemainingSeconds] = useState(10);

  const gameService = gameServiceFactory().build(route.params.isOnlineGame);

  const joinRoom = () => {
    gameService.joinGameRoom()
    .then(v => {if(v) navigation.navigate('BoardScreen', {...route.params})})
    .catch(e => console.log(e))
  };

  const startCountDown = () => {
    joinRoom();
    return setInterval(() => {
      setRemainingSeconds(remainingSeconds => remainingSeconds > 0 ? remainingSeconds - 1 : 0);
    }, 1000);
  }

  useEffect(() => {
    const fnStartCountDown = startCountDown();

    return () => {
      fnStartCountDown
    }
  }, []);

  return (
    <View style={{flex:1, width:'100%', justifyContent:'center', alignItems:'center'}}>
            <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 10, }}>
              Ci serve qualche secondo, stiamo cercando un altro giocatore...
            </Text>
            <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 10, }}>{remainingSeconds}</Text>
            <ActivityIndicator
              color={theme.colors.primaryDark}
              size="large" />

    </View>
  );
}

export default JoinRoomScreeen;