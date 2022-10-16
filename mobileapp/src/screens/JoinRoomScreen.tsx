import React, {  useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import Text from '../components/AppText';
import { useTheme } from "react-native-paper";
import gameServiceFactory from "../services/GameServiceFactory";
import SocketService from "../services/SocketService";
import Config from 'react-native-config';

const BASE_WS_URL = Config.BASE_WS_URL;

const JoinRoomScreeen = ({route, navigation}) => {

  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const REMAINING_SECONDS = 10;
  const [remainingSeconds, setRemainingSeconds] = useState(REMAINING_SECONDS);
  const [noPlayer, setNoPlayer] = useState(false);
  const [retry, setRetry] = useState(0);

  const gameService = gameServiceFactory().build(route.params.isOnlineGame);

  useEffect(() => {
    if(remainingSeconds <= 0) {
      setNoPlayer(true);
      SocketService.disconnect();
    }
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

  }, [retry]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e: any) => {
        if(noPlayer)
          SocketService.disconnect();
      }),
    [navigation]
  );


  return (
    <View style={{flex:1, width:'100%', justifyContent:'center', alignItems:'center'}}>
      {noPlayer ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text textType='bold' style={{ fontSize: 22, textAlign: 'center' }}>
                  Ci dispiace!
            </Text>
            <Text textType='light' style={{ fontSize: 20, textAlign: 'center', marginBottom:20 }}>
                  Al momento non ci sono giocatori disponibili...
            </Text>
            <Pressable style={styles.commandButton} onPress={() => {
              setNoPlayer(false);
              setRemainingSeconds(REMAINING_SECONDS * (retry + 1));
              setRetry(retry => retry + 1);
            }}>
              <Text style={styles.panelButtonTitle}>
                Riprova
              </Text>
            </Pressable>
          </View>
            ): (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator
              color={theme.colors.primaryDark}
              size="large" />
            <Text textType='bold' style={{ fontSize: 22, textAlign: 'center', marginTop: 20  }}>
                  Ci serve qualche secondo!
            </Text>
            <Text textType='light' style={{ fontSize: 20, textAlign: 'center', marginBottom: 10 }}>
                  Stiamo cercando altri giocatori...
            </Text>
            <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 1}}>{remainingSeconds}</Text> 
          </View>
    )
      }

    </View>
  );
}

const makeStyles = (colors:any) => StyleSheet.create({
  view: {
    justifyContent: 'center',
    margin: 20,
  },
  commandButton: {
    alignSelf: 'center',
    padding: 10,
    borderRadius: 10,
    borderColor: colors.primaryDark,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 1,
    width: '90%',
  },
  panelButtonTitle: {
    fontSize: 15,
    color: colors.primaryDark,
  },
});

export default JoinRoomScreeen;