import React, { Component, useEffect, useRef, useState } from 'react';

import {
  LayoutAnimation,
  StyleSheet,
  Animated,
  Platform,
  View,
  Pressable,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Text from './AppText'

import {
  CellSize,
  BorderWidth,
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
      if (letter === " ")
        onCellPress({dx: location.dx, dy: location.dy});
    }

    return (
      <Animated.View style={[styles.cell, pressed && styles.clickedCell]} >
          <Pressable style={styles.handle} onPress={onPress} disabled={pressed}>
              <Text style={[styles.text]}>{letter}</Text>
          </Pressable>
      </Animated.View>
    );
}

const makeStyles = (colors) => StyleSheet.create({
  handle: {
    width: CellSize,
    height: CellSize,
    position: 'absolute',
    top: 0,
    left: 0,
  },
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
    color: '#333',
    fontSize: CellSize * 2 / 3,
    fontFamily: 'HelveticaNeue',
  },
});


export default Cell;