import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import Text from '../components/AppText';
import {HelperText, TextInput, useTheme} from 'react-native-paper';
import UserPreferencesUtils from '../utils/UserPreferencesUtils';
import SocketService from '../services/SocketService';
import SocketSessionUtils from '../utils/SocketSessionUtils';
import NoInternetModal from '../components/modal/NoInternetModal';
import {useNetInfo} from '../hooks';

const JoinRoomScreeen = ({route, navigation}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const scrollbarRef = useRef();
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const originalUsername = useRef('');
  const [isOffline] = useNetInfo();

  const onJoinLobbyPress = useCallback(async () => {
    if (!username || username.length < 5) {
      setErrorMessage('Inserisci un nome utente di almeno 5 caratteri');
      return;
    }
    if (originalUsername.current !== username) {
      await SocketSessionUtils.setSocketSessionID('');
      await SocketSessionUtils.setSocketSessionUserID('');
      await UserPreferencesUtils.setUsername(username);
    }
    navigation.navigate('LobbyScreen', {
      ...route.params,
      username,
    });
  }, [navigation, route.params, username]);

  useEffect(() => {
    SocketService.disconnect();
    UserPreferencesUtils.getUsername().then(name => {
      setUsername(name);
      originalUsername.current = name;
    });
  }, []);

  return (
    <View style={styles.container}>
      <NoInternetModal
        show={isOffline}
        onButtonPress={() => {
          SocketService.disconnect();
          navigation.replace('HomeScreen');
        }}
      />
      <ScrollView
        ref={scrollbarRef}
        keyboardShouldPersistTaps="handled"
        style={{flex: 1}}
        contentContainerStyle={{justifyContent: 'center'}}
        showsVerticalScrollIndicator={false}
      >
        <Text textType="bold" style={{fontSize: 22, textAlign: 'center'}}>
          Inserisci il tuo nome utente ed inizia a giocare!
        </Text>
        <Text
          textType="light"
          style={{fontSize: 20, textAlign: 'center', marginTop: 10}}
        >
          Entra nella lobby, cerca amici o altri giocatori online e divertitevi
          insieme.
        </Text>
        <TextInput
          style={{marginTop: 20, marginBottom: 5}}
          mode="outlined"
          label="Nome utente"
          maxLength={30}
          value={username}
          activeOutlineColor={theme.colors.primaryDark}
          error={errorMessage !== '' ? true : false}
          onPressIn={() => scrollbarRef.current.scrollToEnd({animated: true})}
          onChangeText={text => {
            setErrorMessage('');
            setUsername(text.trim());
          }}
        />
        <HelperText type={'error'} visible={errorMessage !== ''}>
          <Text>{errorMessage}</Text>
        </HelperText>
        <Pressable
          style={styles.commandButton}
          onPress={() => onJoinLobbyPress()}
        >
          <Text style={styles.panelButtonTitle}>Entra</Text>
        </Pressable>
      </ScrollView>
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
      padding: 15,
      borderRadius: 10,
      borderColor: colors.primaryDark,
      backgroundColor: colors.primaryDark,
      borderWidth: 1,
      alignItems: 'center',
      width: '90%',
    },
    panelButtonTitle: {
      fontSize: 16,
      color: '#fff',
    },
  });

export default JoinRoomScreeen;
