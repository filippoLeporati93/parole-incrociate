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
    <View style={{flex:1,}}>
      <Text>
        Parole Incrociate
      </Text>
      <Pressable onPress={() => setModalVisible(true)}>
        <Text>
          Nuova partita
        </Text>
      </Pressable>

      <NewGameContentModal 
      isVisible={isModalVisible} 
      onPress={() => setModalVisible(false)}
      onLevelPress={(level) => {
        setModalVisible(false);
        navigation.navigate("BoardScreen");
      }}/>
    </View>
  );
};

export default HomeScreen;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
    },
    locationBtn: {
      flex: 1,
      width: '30%',
      marginHorizontal: 0,
      alignSelf: 'center',
    },
    locationIcon: {
      borderWidth: 0,
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      width: '90%',
      height: 50,
      backgroundColor: '#fdeae7' /* '#FF6347' */,
      flexDirection: 'row',
      borderRadius: 8,
    },
    locationBtnTxt: {
      alignSelf: 'center',
      fontSize: 15,
      color: '#de4f35',
    },
    sectionText: {
      alignSelf: 'center',
      fontSize: 20,
      color: colors.text,
    },
    exploreCityScroll: {
      minHeight: 240,
      alignSelf: 'center',
      marginBottom: 20,
    },
  });
