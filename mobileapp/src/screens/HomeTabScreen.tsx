import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import Text from '../components/AppText';
import {useTheme} from '@react-navigation/native';



import NewGameContentModal from '../components/modal/NewGameContentModal';

const HomeScreen = ({navigation}: any) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  
  const [isModalVisible, setModalVisible] = useState(false);


  return (
    <View style={styles.container}>
      <Text style={{flex: 1, fontSize: 50,}}>
        Parole Incrociate
      </Text>
    <View style={{
      flex: 1, 
      width: '100%',
      alignItems: 'center', 
      justifyContent: 'flex-end', 
      paddingBottom: 50,
      }}>
      <Pressable style={styles.commandButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.panelButtonTitle}>
          Gioca contro il computer
        </Text>
      </Pressable>
      <Pressable style={styles.commandButton} onPress={() => navigation.navigate("JoinRoomScreen")}>
        <Text style={styles.panelButtonTitle}>
          Gioca contro altri giocatori
        </Text>
      </Pressable>
    </View>

      <NewGameContentModal 
      isVisible={isModalVisible} 
      onPress={() => setModalVisible(false)}
      onLevelPress={(level) => {
        setModalVisible(false);
        navigation.navigate("BoardScreen", {isOnlineGame: false});
      }}/>
    </View>
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
