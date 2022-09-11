import React, { useRef } from 'react';

import {
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import Text from './AppText'

import {
  CellSize,
} from './GlobalStyle';

interface ICell {

  location: { dx: number, dy: number },
  pressed: boolean
  letter: string,
  onCellPress: (location: {dx: number, dy: number}) => void

}

const Cell = ({location, pressed, letter, onCellPress} : ICell) => {

    const theme = useTheme();
    const styles = makeStyles(theme.colors);

    let anim = useRef(new Animated.Value(0)).current;
    const AnimatedTouchable = Animated.createAnimatedComponent(Pressable);

    const rotate = anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const scale = anim.interpolate({
      inputRange: [0, 0.1, 0.9, 1],
      outputRange: [1, 1.1, 1.1, 1],
    });

    const transform = [{ rotate }, { scale }];
    const zIndex = pressed ? 100 : 0;

    const filled = letter !== " ";

    const onPress = () => {
      onCellPress({dx: location.dx, dy: location.dy});
    }

    return (
      <AnimatedTouchable 
        style={[styles.cell, pressed && styles.clickedCell]}
        disabled={pressed}
        onPress={onPress}> 
        <Text 
          style={[styles.text, pressed && styles.clickedText]}>
            {letter}
        </Text>
      </AnimatedTouchable>
    );
}

const makeStyles = (colors) => StyleSheet.create({
  cell: {
    width: CellSize,
    height: CellSize,
    backgroundColor: colors.primaryLight,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  clickedCell: {
    backgroundColor: colors.primaryDark
  },
  text: {
    color: colors.text,
    fontSize: CellSize * 2 / 3,
  },
  clickedText: {
    color: 'white'
  }
});


export default Cell;