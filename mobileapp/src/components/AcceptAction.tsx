import React from 'react';

import {
  StyleSheet,
  Animated,
  Pressable,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';


interface IAcceptAction {

  show: boolean,
  onAcceptPress: () => void,
  onCancelPress: () => void,

}

const AcceptAction = ({show, onAcceptPress, onCancelPress} : IAcceptAction) => {

    const theme = useTheme();
    const styles = makeStyles(theme.colors);

    const AnimatedTouchable = Animated.createAnimatedComponent(Pressable);

    if (!show)
      return null
    else
      return (
        <View style={styles.container}>
          <AnimatedTouchable
          onPress={onCancelPress}>
            <Icon 
              name='close-circle-outline' 
              size={35} 
              color='red'
              style={{marginHorizontal: 30, padding: 5,}}/>
          </AnimatedTouchable>
          <AnimatedTouchable
          onPress={onAcceptPress}>
            <Icon 
              name='checkmark-circle-outline'
              size={35} 
              color='green'
              style={{marginHorizontal: 30, padding: 5}}/>
          </AnimatedTouchable>
        </View>
      );
}

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});


export default AcceptAction;