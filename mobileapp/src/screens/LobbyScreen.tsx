import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {
  BackHandler,
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Alert,
} from 'react-native';
import Text from '../components/AppText';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import gameServiceFactory from '../services/GameServiceFactory';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import {gamer} from '../models/Types';
import uuid from 'react-native-uuid';
import SocketService from '../services/SocketService';

const myRoomId = uuid.v4();

const LobbyScreen = ({route, navigation}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const [isLoading, setIsLoading] = useState(false);
  const [gamers, setGamers] = useState<gamer[]>([]);
  const [myUserID, setMyUserID] = useState('');
  const myUserName = route.params.username;
  const [originalGamers, setOriginalGamers] = useState<gamer[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const gameService = useMemo(
    () => gameServiceFactory().build(route.params.isOnlineGame),
    [route.params.isOnlineGame]
  );

  const onUsersChanges = useCallback(
    gmrs => {
      setOriginalGamers(gmrs);
      if (!searchText || searchText === '') {
        setGamers(gmrs);
      } else {
        setGamers(
          gmrs.filter(e =>
            e.username.toLowerCase().startsWith(searchText.toLowerCase())
          )
        );
      }
    },
    [searchText]
  );

  const onSessionCallback = useCallback(userID => setMyUserID(userID), []);
  const onUsersCallback = useCallback(
    users => onUsersChanges(users),
    [onUsersChanges]
  );

  const showJoinGameAlert = useCallback(
    (roomId: string, userID: string, username: string) =>
      // Prompt the user before leaving the screen
      Alert.alert(
        'Nuova richiesta di gioco!',
        username + ' ( ' + userID + ' )' + ' vorrebbe giocare con te',
        [
          {
            text: 'Rifiuta',
            style: 'cancel',
            onPress: () => {
              gameService.roomJoined(roomId, userID, false);
            },
          },
          {
            text: 'Accetta',
            style: 'default',
            // If the user confirmed, then we dispatch the action we blocked earlier
            // This will continue the action that had triggered the removal of the screen
            onPress: () => {
              gameService.roomJoined(roomId, userID, true);
            },
          },
        ]
      ),
    [gameService]
  );

  const showRefuseGameAlert = useCallback(
    (userID: string) =>
      // Prompt the user before leaving the screen
      Alert.alert(
        'La tua richiesta di gioco è stata rifiutata!',
        userID + ' non ha accettato',
        [
          {
            text: 'Ok',
            style: 'default',
          },
        ]
      ),
    []
  );

  // keep only 'refresh' in the useEffect trigger!
  useEffect(() => {
    let offUserConnected = () => {};
    let offUserDisconnected = () => {};
    let offJoinGame = () => {};
    let offRoomJoined = () => {};
    let offStartGame = () => {};

    SocketService.connect(myUserName, onSessionCallback, onUsersCallback).then(
      () => {
        SocketService.userConnected();
        offUserConnected = SocketService.onUserConnected(onUsersChanges);
        offUserDisconnected = SocketService.onUserDisconnected(onUsersChanges);
        offJoinGame = gameService.onJoinGameRoom(
          (roomId, requesterUserID, requesterUsername) => {
            showJoinGameAlert(roomId, requesterUserID, requesterUsername);
          }
        );
        offRoomJoined = gameService.onRoomJoined(
          (roomId, responseUserID, accepted) => {
            if (roomId === myRoomId) {
              if (accepted) {
                gameService.startGame(roomId);
                navigation.replace('BoardScreen', {
                  ...route.params,
                  start: true,
                  roomId,
                });
              } else {
                showRefuseGameAlert(responseUserID);
              }
              setIsLoading(false);
            }
          }
        );
        offStartGame = gameService.onStartGame(
          (firstPlayer: boolean, roomId?: string) => {
            navigation.replace('BoardScreen', {
              ...route.params,
              start: firstPlayer,
              roomId,
            });
          }
        );
      }
    );

    return () => {
      offUserConnected();
      offUserDisconnected();
      offJoinGame();
      offRoomJoined();
      offStartGame();
    };
  }, [
    onSessionCallback,
    onUsersCallback,
    onUsersChanges,
    myUserName,
    gameService,
    showJoinGameAlert,
    navigation,
    route.params,
    showRefuseGameAlert,
  ]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        SocketService.disconnect();
        return false;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  const handleSearch = useCallback(
    (text: string) => {
      if (!text || text === '') {
        setGamers(originalGamers);
      } else {
        setGamers(
          originalGamers.filter(
            e =>
              e.username.toLowerCase().startsWith(text.toLowerCase()) ||
              e.userID.toLowerCase().startsWith(text.toLowerCase())
          )
        );
      }
    },
    [originalGamers]
  );

  const _renderItem = useCallback(
    ({item}: {item: gamer}) => (
      <TouchableOpacity
        style={{
          padding: 13,
          borderRadius: 10,
          backgroundColor: theme.colors.primaryLight,
          marginVertical: 10,
        }}
        onPress={() => {
          setIsLoading(true);
          gameService.joinGameRoom(myRoomId, myUserID, myUserName, item.userID);
        }}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name={'account'} size={30} color={theme.colors.primaryDark} />
          <View
            style={{flexDirection: 'column', marginLeft: 10, marginRight: 20}}
          >
            <Text style={{fontSize: 22}}>{item.username}</Text>
            <Text style={{fontSize: 12, color: 'gray'}}>{item.userID}</Text>
          </View>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}
        >
          <Icon name={'grid'} size={18} color={theme.colors.primaryDark} />
          <Text style={{fontSize: 18, marginStart: 5, marginEnd: 18}}>
            {item.statsInfo && item.statsInfo.gamePlayed}
          </Text>
          <Icon
            name={'trophy-outline'}
            size={18}
            color={theme.colors.primaryDark}
          />
          <Text style={{fontSize: 18, marginStart: 5, marginEnd: 18}}>
            {item.statsInfo && item.statsInfo.gameWon}
          </Text>
          <Icon
            name={'flag-outline'}
            size={18}
            color={theme.colors.primaryDark}
          />
          <Text style={{fontSize: 18, marginStart: 5, marginEnd: 18}}>
            {item.statsInfo &&
              (item.statsInfo.percGameWon * 100).toFixed(0) + '%'}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [
      gameService,
      myUserID,
      myUserName,
      theme.colors.primaryDark,
      theme.colors.primaryLight,
    ]
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 15,
          paddingBottom: 10,
        }}
      >
        <Pressable
          onPress={() => {
            SocketService.disconnect();
            navigation.goBack();
          }}
          style={{flex: 1}}
        >
          <Icon name={'close'} size={25} color={theme.colors.text} />
        </Pressable>
        <Text numberOfLines={1} style={{flex: 5, fontSize: 18}}>
          {myUserID}
        </Text>
      </View>
      <View style={styles.searchBox}>
        <Icon name="magnify" size={18} color={theme.colors.primaryDark} />
        <TextInput
          style={styles.searchText}
          onChangeText={text => {
            setSearchText(text);
            handleSearch(text);
          }}
          placeholder="Cerca un giocatore online..."
          placeholderTextColor={theme.colors.text}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="always"
        />
      </View>
      <Text style="light" style={{fontSize: 10, marginTop: 10}}>
        Giocatori online: {gamers && gamers.length}
      </Text>
      {!isLoading ? (
        <>
          <View style={{flex: 1, justifyContent: 'center'}}>
            {gamers && gamers.length > 0 ? (
              <FlatList data={gamers} renderItem={_renderItem} />
            ) : (
              <View style={{flex: 1, justifyContent: 'center'}}>
                <Text
                  textType="bold"
                  style={{fontSize: 22, textAlign: 'center'}}
                >
                  Ci dispiace!
                </Text>
                <Text
                  textType="light"
                  style={{fontSize: 20, textAlign: 'center', marginBottom: 20}}
                >
                  Al momento non ci sono giocatori disponibili...
                </Text>
              </View>
            )}
          </View>
        </>
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text
            textType="bold"
            style={{fontSize: 22, textAlign: 'center', marginBottom: 10}}
          >
            In attesa che il giocatore accetti il tuo invito...
          </Text>
          <ActivityIndicator color={theme.colors.primaryDark} size="smalle" />
        </View>
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '90%',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    commandButton: {
      alignSelf: 'center',
      padding: 10,
      borderRadius: 10,
      borderColor: colors.primaryDark,
      borderWidth: 1,
      alignItems: 'center',
      width: '90%',
    },
    panelButtonTitle: {
      fontSize: 15,
      color: colors.primaryDark,
    },
    searchBox: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'gray',
      borderRadius: 8,
      marginTop: 10,
      paddingHorizontal: 10,
    },
    searchText: {
      flex: 1,
      fontSize: 13,
      justifyContent: 'center', //Centered horizontally
      alignItems: 'center', //Centered vertically
      marginStart: 5,
      color: colors.text,
      fontFamily: 'AirbnbCereal_W_Md',
    },
  });

export default LobbyScreen;
