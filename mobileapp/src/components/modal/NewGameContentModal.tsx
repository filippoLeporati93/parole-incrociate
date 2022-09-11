import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import Modal from "react-native-modal";

type Props = {
  isVisible: boolean;
  onLevelPress: (level: number) => any;
  onPress: () => any;
};

const NewGameContentModal: React.FC<Props> = props => (
  <Modal 
    isVisible={props.isVisible}
    onBackdropPress={props.onPress}
    onSwipeComplete={props.onPress}
    swipeDirection={['down']}
    useNativeDriverForBackdrop
    style={styles.view}>
    <View style={styles.content}>
      <Text style={styles.contentTitle} onPress={() => props.onLevelPress(1)}>Facile</Text>
      <View style={styles.line} />
      <Text style={styles.contentTitle} onPress={() => props.onLevelPress(1)}>Medio</Text>
      <View style={styles.line} />
      <Text style={styles.contentTitle} onPress={() => props.onLevelPress(1)} >Difficile</Text>
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
    marginBottom: 20,
  },
  line: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    marginStart: 5,
    marginEnd: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'gray',
  }
});

export default NewGameContentModal;