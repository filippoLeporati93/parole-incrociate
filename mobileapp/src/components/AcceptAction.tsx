import React from 'react';

import {
  StyleSheet,
  Animated,
  Pressable,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Text from './AppText';


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
              <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 }}>
            <Icon 
              name='close-circle-outline' 
              size={30} 
              color='red'/>
            <Text textType='light' style={{color:'red', fontSize:11}}>Cancella</Text>
            </View>
          </AnimatedTouchable>

          <AnimatedTouchable
          onPress={onAcceptPress}>
         <View style={{flexDirection:'row',justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 }}>
            <Icon 
              name='checkmark-circle-outline'
              size={30} 
              color='green'/>
             <Text textType='light' style={{color:'green', fontSize:11,}}>OK</Text>
             </View>
          </AnimatedTouchable>
        </View>
      );
}

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  }
});


export default AcceptAction;