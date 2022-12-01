import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import Text from '../AppText';

type Props = {
  isVisible: boolean;
  onLevelPress: (level: number, levelDesc: string) => any;
  onPress: () => any;
};

const NewGameContentModal: React.FC<Props> = props => (
  <Modal
    isVisible={props.isVisible}
    onBackdropPress={props.onPress}
    onSwipeComplete={props.onPress}
    swipeDirection={['down']}
    useNativeDriverForBackdrop
    style={styles.view}
  >
    <View style={styles.content}>
      <Text
        textType="bold"
        style={{fontSize: 18, color: 'gray', marginBottom: 20}}
      >
        Difficoltà di gioco
      </Text>
      <Pressable
        style={{alignItems: 'center'}}
        onPress={() => props.onLevelPress(1, 'Facile')}
      >
        <Text style={styles.contentTitle}>Facile</Text>
        <Text textType="light" style={styles.textHelp}>
          Avversario genera parole corte
        </Text>
      </Pressable>
      <View style={styles.line} />
      <Pressable
        style={{alignItems: 'center'}}
        onPress={() => props.onLevelPress(2, 'Medio')}
      >
        <Text style={styles.contentTitle}>Medio</Text>
        <Text textType="light" style={styles.textHelp}>
          Avversario genera parole medie
        </Text>
      </Pressable>
      <View style={styles.line} />
      <Pressable
        style={{alignItems: 'center'}}
        onPress={() => props.onLevelPress(3, 'Difficile')}
      >
        <Text style={styles.contentTitle}>Difficile</Text>
        <Text textType="light" style={styles.textHelp}>
          Avversario genera parole lunghe
        </Text>
      </Pressable>
      <View style={styles.line} />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 20,
    marginBottom: 30,
  },
  content: {
    backgroundColor: 'white',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
  },
  line: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    marginStart: 5,
    marginEnd: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'gray',
  },
  textHelp: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default NewGameContentModal;
