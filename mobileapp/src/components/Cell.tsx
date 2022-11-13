import React from 'react';

import {StyleSheet, Animated, Pressable} from 'react-native';
import {useTheme} from 'react-native-paper';
import Text from './AppText';

interface ICell {
  location: {dx: number; dy: number};
  pressed: boolean;
  letter: string;
  onCellPress?: (location: {dx: number; dy: number}) => void;
  cellSize: number;
}

const Cell = ({location, pressed, letter, onCellPress, cellSize}: ICell) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors, cellSize);

  const AnimatedTouchable = Animated.createAnimatedComponent(Pressable);

  const onPress = () => {
    if (onCellPress) {
      onCellPress({dx: location.dx, dy: location.dy});
    }
  };

  return (
    <AnimatedTouchable
      style={[styles.cell, pressed && styles.clickedCell]}
      disabled={pressed}
      onPress={onPress}
    >
      <Text style={[styles.text, pressed && styles.clickedText]}>{letter}</Text>
    </AnimatedTouchable>
  );
};

const makeStyles = (colors, cellSize) =>
  StyleSheet.create({
    cell: {
      width: cellSize,
      height: cellSize,
      backgroundColor: colors.primaryLight,
      borderWidth: StyleSheet.hairlineWidth,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    clickedCell: {
      backgroundColor: colors.primaryDark,
    },
    text: {
      color: colors.text,
      fontSize: (cellSize * 2) / 3,
    },
    clickedText: {
      color: 'white',
    },
  });

export default Cell;
