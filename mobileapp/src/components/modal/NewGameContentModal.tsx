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
    swipeDirection={['left', 'down', 'right']}
    useNativeDriverForBackdrop
    style={styles.view}>
    <View style={styles.content}>
      <Text style={styles.contentTitle} onPress={props.onLevelPress(1)}>Facile</Text>
      <Text style={styles.contentTitle} onPress={props.onLevelPress(1)}>Medio</Text>
      <Text style={styles.contentTitle} onPress={props.onLevelPress(1)} >Difficile</Text>
      <Button testID={'close-button'} onPress={props.onPress} title="Chiudi" />
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});

export default NewGameContentModal;