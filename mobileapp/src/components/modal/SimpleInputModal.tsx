import {useTheme} from '@react-navigation/native';
import React, {FC, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../AppText';
import Icon from 'react-native-vector-icons/Ionicons';
interface ISImpleInputModal {
  title: string;
  icon: string;
  label: string;
  show: boolean;
  onPressOk: (inputText: string) => void;
  onPressCancel: () => void;
}

const SimpleInputModal: FC<ISImpleInputModal> = ({
  title,
  icon,
  label,
  show,
  onPressOk,
  onPressCancel,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const styles = makeStyles(colors);
  const [text, setText] = useState('');
  const inputRef = useRef<null | TextInput>(null);

  return (
    <Modal animationType="slide" transparent={true} visible={show}
      onShow={() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 13,
            }}
          >
            <Icon name={icon} color={theme.colors.primary} size={20} />
            <Text style={styles.modalText}>{title}</Text>
          </View>
          <View style={styles.divider} />
          <View
            style={{
              flex: 2,
              width: '100%',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Text
              style={{
                flex: 1,
                marginTop: 10,
                marginStart: 10,
                fontWeight: 'bold',
                color: colors.text,
              }}
            >
              {label}
            </Text>
            <TextInput
              ref={input => {
                inputRef.current = input;
              }}
              style={{
                backgroundColor: 'white',
                borderWidth: 0.2,
                borderRadius: 1,
                width: '80%',
                marginStart: 10,
                marginBottom: 10,
                padding: 10,
              }}
              onChangeText={newText => setText(newText)}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
            />
          </View>
          <View style={styles.divider} />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity
              style={[styles.buttonOK]}
              onPress={() => onPressOk(text)}
              disabled={!text || text.length === 0}
            >
              <Text style={styles.textButtonStyle}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonCancel]}
              onPress={() => { setText(''); onPressCancel();}}
            >
              <Text style={[styles.textButtonStyle, {color: theme.colors.primary}]}>
                Annulla
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SimpleInputModal;

const makeStyles = colors =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
    },
    modalView: {
      alignSelf: 'center',
      flexDirection: 'column',
      backgroundColor: 'white',
      borderRadius: 5,
      height: 200,
      width: 300,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      padding: 3,
    },
    buttonOK: {
      padding: 5,
      minWidth: 50,
      justifyContent: 'center',
      borderRadius: 10,
      backgroundColor: colors.primary,
      alignItems: 'center',
      marginVertical: 8,
      marginHorizontal: 8,
    },
    buttonCancel: {
      padding: 5,
      justifyContent: 'center',
      borderRadius: 10,
      borderColor: colors.primary,
      borderWidth: 1,
      alignItems: 'center',
      marginVertical: 8,
      marginHorizontal: 8,
    },
    textStyle: {
      color: colors.text,
      textAlign: 'center',
    },
    textButtonStyle: {
      color: 'white',
      textAlign: 'center',
    },
    modalText: {
      flex: 1,
      color: colors.text,
      marginStart: 10,
      fontSize: 17,
    },
    divider: {
      borderBottomWidth: 0.8,
      borderBottomColor: '#ccc',
      width: '100%',
    },
  });
