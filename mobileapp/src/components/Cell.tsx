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
    borderColor: 'orange',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: BorderWidth,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    color: '#333',
    fontSize: CellSize * 2 / 3,
    fontFamily: 'HelveticaNeue',
  },
  editingText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'teal',
    fontSize: CellSize * 2 / 5,
    marginHorizontal: CellSize / 8,
    ...Platform.select({
      ios: {
        marginTop: CellSize / 12,
        lineHeight: CellSize * 2 / 5
      },
      android: {
        lineHeight: Math.floor(CellSize * 2 / 4),
      },
    })
  },
  filledCell: {
    backgroundColor: 'moccasin',
  },
  fixedCell: {
    backgroundColor: 'khaki',
  },
  fixedText: {
    color: '#666',
  },
  highlightCell: {
    backgroundColor: 'peru',
  },
  highlightText: {
    color: '#fff',
  },
});


export default Cell;