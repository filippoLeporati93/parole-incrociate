import React, {useLayoutEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  View,
  Dimensions,
  Pressable,
  Button,
} from 'react-native';
import Text from '../components/AppText';
import {useTheme} from '@react-navigation/native';

import Modal from "react-native-modal";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({navigation}: any) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View>
      <Text>
        Parole Incrociate
      </Text>
      <Pressable>
        <Text>
          Nuova partita
        </Text>
      </Pressable>

      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1 }}>
          <Text>Hello!</Text>

          <Button title="Hide modal" onPress={toggleModal} />
        </View>
      </Modal>
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
