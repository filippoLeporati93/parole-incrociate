import {useTheme} from '@react-navigation/native';
import React, {FC} from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from '../AppText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
interface INoInternetModal {
  show: boolean;
  onButtonPress: () => void;
}

const NoInternetModal: FC<INoInternetModal> = ({show, onButtonPress}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <Modal animationType="slide" transparent={true} visible={show}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Icon name="wifi-off" size={35} color={theme.colors.text} />
          <Text textType='light' style={styles.modalText}>
            Sembra che tu non abbia nessuna connessione dati attiva!
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onButtonPress()}
          >
            <Text style={styles.textStyle}>Torna alla Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NoInternetModal;

const makeStyles = colors =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 30,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      padding: 15,
      borderRadius: 10,
      backgroundColor: colors.primaryDark,
      alignItems: 'center',
      marginTop: 10,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      textType: 'bold',
      fontSize: 17,
      marginVertical: 15,
      textAlign: 'center',
      color: colors.text,
    },
  });
