import React, { Component, useEffect, useRef, useState } from 'react';

import {
  LayoutAnimation,
  StyleSheet,
  Animated,
  Platform,
  View,
  Pressable,
} from 'react-native';
import Text from './AppText'

import {
  CellSize,
  BorderWidth,
} from './GlobalStyle';

interface ICell {

  xIndex: number,
  yIndex: number,
  letter: string,
  onCellPress: (xIndex: number, yIndex: number) => void

}

const Cell = ({xIndex, yIndex, letter, onCellPress} : ICell) => {

    const [clicked, setClicked] = useState(false);

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
    const zIndex = clicked ? 100 : 0;

    const filled = letter !== " ";

    const onPress = () => {
      setClicked(clicked => !clicked);
      onCellPress(xIndex, yIndex);
    }

    return (
      <Animated.View style={[styles.cell, filled&&styles.filledCell, clicked && styles.highlightCell, {transform, zIndex}]} >
          <Pressable style={styles.handle} onPress={onPress} disabled={clicked}>
              <Text style={[styles.text, clicked && styles.highlightText]}>{letter}</Text>
          </Pressable>
      </Animated.View>
    );
}

const styles = StyleSheet.create({
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
    backgroundColor: 'lightyellow',
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    color: '#333',
    fontSize: CellSize * 2 / 3,
    fontFamily: 'HelveticaNeue',
  },
});


export default Cell;