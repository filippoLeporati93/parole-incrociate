import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Pressable,
} from 'react-native';

import {
  BoardWidth,
  BorderWidth,
  CellStackSize,
} from './GlobalStyle';


const Offset = (BoardWidth - CellStackSize * 10 - BorderWidth * 12) / 13;

interface IStackCell {
  letter: string,
  onStackCellPress: (letter: string) => void,
}

const StackCell = ({letter, onStackCellPress}: IStackCell) => {

  const onPress = () => {
    onStackCellPress(letter);
  }

    return (
        <View style={styles.cell} >
          <Pressable onPress={onPress}>
            <Text style={styles.text}>{letter}</Text>
          </Pressable>
        </View>
    
    );

}

const styles = StyleSheet.create({
  cell: {
    width: CellStackSize,
    height: CellStackSize,
    backgroundColor: 'moccasin',
    borderColor: 'orange',
    borderWidth: BorderWidth,
    borderRadius: BorderWidth,
    alignItems: 'center',
    justifyContent: 'center',
    margin: Offset,
  },
  text: {
    color: '#666',
    fontSize: CellStackSize * 2 / 3,
    fontFamily: 'HelveticaNeue',
  }
});


export default StackCell;