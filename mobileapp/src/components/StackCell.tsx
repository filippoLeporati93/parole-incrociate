import React, { Component, useState } from 'react';

import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';

import {
  BoardWidth,
  BorderWidth,
  CellStackSize,
} from './GlobalStyle';


const Offset = (BoardWidth - CellStackSize * 10 - BorderWidth * 12) / 13;

interface IStackCell {
  letter: string,
  pressed: boolean,
  onStackCellPress: (letter: string) => void,
}

const StackCell = ({letter, onStackCellPress}: IStackCell) => {

  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [isPressed, setIsPressed] = useState(false);

  const onPress = () => {
    onStackCellPress(letter);
  }

  return (
    <View>
      <TouchableHighlight 
      style= {[styles.cell, isPressed && styles.cellPressed]}
      onPress={onPress}
      onHideUnderlay={()=> setIsPressed(false)} 
      onShowUnderlay={()=> setIsPressed(true)}>
        <Text style={[styles.text, isPressed && styles.textPressed]}>{letter}</Text>
      </TouchableHighlight>
    </View>
  );

}

const makeStyles = (colors) => StyleSheet.create({
  cell: {
    width: CellStackSize,
    height: CellStackSize *  1.5,
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryDark,
    borderWidth: BorderWidth,
    borderRadius: BorderWidth,
    alignItems: 'center',
    justifyContent: 'center',
    margin: Offset,
  },
  cellPressed:{
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight
  },
  text: {
    color: colors.text,
    fontSize: CellStackSize * 2 / 3,
  },
  textPressed: {
    color: 'white',
  }
});


export default StackCell;