import React, { Component } from 'react';

import {
  LayoutAnimation,
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';

import {
  Size,
  CellSize,
  BoardWidth,
  BorderWidth,
} from './GlobalStyle';


const Offset = (BoardWidth - CellSize * 9 - BorderWidth * 8) / 2;

interface IStackCell {
  letter: string,
  onStackCellPress: (letter: string) => void,
}

const StackCell = ({letter, onStackCellPress}: IStackCell) => {

  const onPress = () => {
    onStackCellPress(letter);
  }

    return (
      <Pressable onPress={onPress} style={[styles.container]} >
        <View style={styles.cell} >
          <Text style={styles.text}>{letter}</Text>
        </View>
      </Pressable>
    );

}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: CellSize,
    height: CellSize,
  },
  cell: {
    width: CellSize,
    height: CellSize,
    backgroundColor: 'moccasin',
    borderColor: 'orange',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: BorderWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#666',
    fontSize: CellSize * 2 / 3,
    fontFamily: 'HelveticaNeue',
  }
});


export default StackCell;