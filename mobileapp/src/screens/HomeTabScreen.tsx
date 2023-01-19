import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Pressable, Image, SafeAreaView, Platform} from 'react-native';
import Text from '../components/AppText';
import {useTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import InAppReviewUtils from '../utils/InAppReviewUtils';

import NewGameContentModal from '../components/modal/NewGameContentModal';

const HomeScreen = ({navigation}: any) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const [isNewGameModalVisible, setNewGameModalVisible] = useState(false);

  useEffect(() => {
    InAppReviewUtils.incrementAppOpening().then(appreview => {
      InAppReviewUtils.showReviewPane(appreview);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={{
          alignSelf: 'flex-end',
          marginRight: 20,
        }}
        onPress={() => navigation.navigate('SettingsScreen')}
      >
        <Icon size={25} name={'cog-outline'} color={theme.colors.primaryDark} />
      </Pressable>

      <View
        style={{flex: 2, alignContent: 'flex-start', justifyContent: 'center'}}
      >
        <Image
          style={{width: 70, height: 70, alignSelf: 'center', marginTop: 10}}
          source={require('../assets/img/ic_launcher-web.png')}
        />
        <Text
          textType="bold"
          style={{
            textAlign: 'center',
            fontSize: 60,
            color: theme.colors.primaryDark,
          }}
        >
          Parole
        </Text>
        <Text
          textType="bold"
          style={{
            textAlign: 'center',
            fontSize: 60,
            color: theme.colors.primary,
          }}
        >
          Incrociate
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 50,
        }}
      >
        <Pressable
          style={{padding: 15, marginBottom: 10}}
          onPress={() => navigation.navigate('HowToPlayScreen')}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon
              name="school-outline"
              color={theme.colors.primaryDark}
              size={20}
            />
            <Text
              style={{
                color: theme.colors.primaryDark,
                fontSize: 18,
                marginStart: 10,
              }}
            >
              Come si gioca?
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.commandButton}
          onPress={() => setNewGameModalVisible(true)}
        >
          <Text style={styles.panelButtonTitle}>Gioca contro il computer</Text>
        </Pressable>
        <Pressable
          style={styles.commandButton}
          onPress={() =>
            navigation.navigate('JoinRoomScreen', {
              isOnlineGame: true,
              level: -1,
              levelDesc: 'Online',
            })
          }
        >
          <Text style={styles.panelButtonTitle}>
            Gioca contro altri giocatori
          </Text>
        </Pressable>
      </View>
      <NewGameContentModal
        isVisible={isNewGameModalVisible}
        onPress={() => setNewGameModalVisible(false)}
        onLevelPress={(level, levelDesc) => {
          setNewGameModalVisible(false);
          navigation.navigate('BoardScreen', {
            isOnlineGame: false,
            level: level,
            levelDesc: levelDesc,
            start: true,
          });
        }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.backgroundHome,
    },
    commandButton: {
      padding: 15,
      borderRadius: 10,
      backgroundColor: colors.primaryDark,
      alignItems: 'center',
      marginVertical: 10,
      width: '90%',
    },
    commandButtonDisabled: {
      padding: 15,
      borderRadius: 10,
      backgroundColor: '#D3D3D3',
      alignItems: 'center',
      marginTop: 10,
      width: '90%',
    },
    panelButtonTitle: {
      fontSize: 17,
      color: 'white',
      fontFamily: 'AirbnbCereal_W_Md',
    },
  });
