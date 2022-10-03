import React, {  useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Text from '../components/AppText';
import { useTheme } from "react-native-paper";
import gameServiceFactory from "../services/GameServiceFactory";


const JoinRoomScreeen = ({route, navigation}) => {

  const theme = useTheme();

  const tentative = useRef(0);
  const [remainingSeconds, setRemainingSeconds] = useState(10);
  const [noPlayer, setNoPlayer] = useState(false);

  const gameService = gameServiceFactory().build(route.params.isOnlineGame);

  const tryJoining = async () => {
    try {
     const result = await gameService.joinGameRoom();
     if(result) {
        navigation.replace('BoardScreen', {...route.params});
      } else { 
        tentative.current = tentative.current + 1;
      }
    } catch(e) { 
        console.error(e)
    }
  }


  useEffect(() => {
    const fnSeconds = setInterval(() => {
      setRemainingSeconds(remainingSeconds => remainingSeconds > 0 ? remainingSeconds - 1 : 0);
    }, 1000);
    return () => clearInterval(fnSeconds)
  }, []);

  useEffect(() => {
    if(tentative.current <= 5 && remainingSeconds >= 0) {
      const timeout = setTimeout(() => tryJoining(), 2000);
      return () => clearTimeout(timeout);
    } else {
      setNoPlayer(true)
    }
  }, [tentative.current]);

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
              Ci serve qualche secondo, stiamo cercando un altro giocatore...
            </Text>
            <Text style={{ fontSize: 40, textAlign: 'center', }}>{remainingSeconds}</Text>
            </>
    )
      }

    </View>
  );
}

export default JoinRoomScreeen;