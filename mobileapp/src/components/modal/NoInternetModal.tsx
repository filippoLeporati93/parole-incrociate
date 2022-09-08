import {useTheme} from '@react-navigation/native';
import React, {FC} from 'react';
import {
  BackHandler,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../AppText';
interface INoInternetModal {
  show: boolean;
}

const NoInternetModal: FC<INoInternetModal> = ({show}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <Modal animationType="slide" transparent={true} visible={show}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Ops! Sembra che tu non abbia nessuna connessione internet! {'\n\n'}
            Attivala dalle impostazioni del tuo cellulare!
          </Text>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => {
              BackHandler.exitApp();
            }}
          >
            <Text style={styles.textStyle}>Chiudi Spots</Text>
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
      backgroundColor: colors.primary,
      alignItems: 'center',
      marginTop: 10,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      color: colors.text,
    },
  });
