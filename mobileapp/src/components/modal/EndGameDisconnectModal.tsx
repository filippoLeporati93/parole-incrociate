import React from 'react';
import {Button, Dimensions, Pressable, StyleSheet, View} from 'react-native';
import Modal from "react-native-modal";
import { useTheme } from 'react-native-paper';
import Text from '../AppText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  isVisible: boolean;
  onBackPress: () => any;
};

const {width} = Dimensions.get('window');

const EndGameDisconnectModal: React.FC<Props> = props => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  return (
  <Modal 
    isVisible={props.isVisible}
    onBackdropPress={props.onBackPress}
    useNativeDriverForBackdrop
    style={styles.view}>
    <View style={styles.content}>
    <View
        style={[styles.header, {backgroundColor: theme.colors.primaryDark}]}
      />
    <Pressable style={{position: 'absolute', top: 10, left: 10,}}
    onPress={props.onBackPress}>
      <Icon 
        name="close" 
        color={"white"} 
        size={25}
      />
    </Pressable>

      <Text textType='light'
      style={styles.contentSubTitle}>L'avversario si è disconnesso</Text>
      
      <Text textType='bold' style={styles.contentTitle}>Ops!</Text>
      
      <Pressable style={styles.commandButton} onPress={() => props.onBackPress()}>
        <Text style={styles.panelButtonTitle}>
          Fine
        </Text>
      </Pressable>
    </View>
  </Modal>
)
  };

const makeStyles = (colors:any) => StyleSheet.create({
  view: {
    justifyContent: 'center',
    margin: 20,
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    textAlign: 'center',
    fontSize: 35,
    color: 'white',
  },
  contentSubTitle: {
    textAlign: 'center',
    fontSize: 25,
    color: 'white'
  },
  header: {
    position: 'absolute',
    top: 0,
    height: 150,
    width: (width - 40) / 2,
    alignSelf: 'center',
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
    transform: [
      {scaleX: 2}
    ]
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 10,
    width: '90%',
  },
  panelButtonTitle: {
    fontSize: 17,
    color: 'white',
    fontFamily: 'AirbnbCereal_W_Md',
  },
});

export default EndGameDisconnectModal;