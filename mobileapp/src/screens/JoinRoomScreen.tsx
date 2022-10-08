import React, {  useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Text from '../components/AppText';
import { useTheme } from "react-native-paper";
import gameServiceFactory from "../services/GameServiceFactory";
import SocketService from "../services/SocketService";
import Config from 'react-native-config';

const BASE_WS_URL = Config.BASE_WS_URL;

const JoinRoomScreeen = ({route, navigation}) => {

  const theme = useTheme();

  const [remainingSeconds, setRemainingSeconds] = useState(10);
  const [noPlayer, setNoPlayer] = useState(false);

  const gameService = gameServiceFactory().build(route.params.isOnlineGame);

  useEffect(() => {
    if(remainingSeconds <= -100000)
      setNoPlayer(true);
  }, [remainingSeconds]);
 
  useEffect(() => {
    SocketService
    .connect(BASE_WS_URL)
    .then(() => {
      gameService.onStartGame((start, roomId) => {
        navigation.replace('BoardScreen', {...route.params, start, roomId});
      });
      gameService.joinGameRoom().catch(e => console.error(e))
    })
    .catch((err) => {
      console.error("Error: ", err);
    });

    const fnSeconds = setInterval(() => {
      setRemainingSeconds(remainingSeconds => remainingSeconds > 0 ? remainingSeconds - 1 : 0);
    }, 1000);

    return () => clearInterval(fnSeconds)

  }, []);



  useEffect(() => {
    
  }, []);



  return (
    <View style={{flex:1, width:'100%', justifyContent:'center', alignItems:'center'}}>
      {noPlayer ? (<Text style={{ fontSize: 20, textAlign: 'center' }}>
              Ci dispiace ma al momento non ci sono giocatori disponibili...
            </Text>
            ): (
              <>
          <ActivityIndicator
              color={theme.colors.primaryDark}
              size="large" />
            <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 10, marginTop: 20 }}>
              Ci serve qualche secondo, stiamo cercando altri giocatori...
            </Text>
            <Text style={{ fontSize: 40, textAlign: 'center', }}>{remainingSeconds}</Text>
            
            </>
    )
      }

    </View>
  );
}

export default JoinRoomScreeen;