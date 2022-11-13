import React from 'react';

import {StyleSheet, Animated, Pressable, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Text from './AppText';

interface IAcceptAction {
  onAcceptPress: () => void;
  onCancelPress: () => void;
}

const AcceptAction = ({onAcceptPress, onCancelPress}: IAcceptAction) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const AnimatedTouchable = Animated.createAnimatedComponent(Pressable);

  return (
    <View style={styles.container}>
      <AnimatedTouchable onPress={onCancelPress}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 35,
          }}
        >
          <Icon name="close-circle-outline" size={30} color="gray" />
          <Text textType="light" style={{color: 'gray', fontSize: 20}}>
            Annulla
          </Text>
        </View>
      </AnimatedTouchable>

      <AnimatedTouchable onPress={onAcceptPress}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 35,
          }}
        >
          <Icon
            name="checkmark-circle-outline"
            size={30}
            color={theme.colors.primaryDark}
          />
          <Text
            textType="light"
            style={{color: theme.colors.primaryDark, fontSize: 20}}
          >
            Conferma
          </Text>
        </View>
      </AnimatedTouchable>
    </View>
  );
};

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });

export default AcceptAction;
