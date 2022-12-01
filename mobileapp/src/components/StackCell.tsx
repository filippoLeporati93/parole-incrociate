import React, {Component, useState} from 'react';

import {StyleSheet, View, Text} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';

import {BoardWidth, BorderWidth, CellStackSize} from './GlobalStyle';

const Offset = (BoardWidth - CellStackSize * 10 - BorderWidth * 12) / 13;

interface IStackCell {
  isDisabled: boolean;
  letter: string;
  onStackCellPress: (letter: string) => void;
  pressed: boolean;
}

const StackCell = ({
  isDisabled,
  letter,
  onStackCellPress,
  pressed,
}: IStackCell) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View>
      <TouchableHighlight
        style={[
          styles.cell,
          (isPressed || pressed) && styles.cellPressed,
          isDisabled && styles.cellDisabled,
        ]}
        disabled={isDisabled}
        onPress={() => {
          onStackCellPress(letter);
        }}
        onHideUnderlay={() => setIsPressed(false)}
        onShowUnderlay={() => setIsPressed(true)}
        underlayColor={theme.colors.primaryDark}
      >
        <Text
          style={[styles.text, (isPressed || pressed) && styles.textPressed]}
        >
          {letter}
        </Text>
      </TouchableHighlight>
    </View>
  );
};

const makeStyles = colors =>
  StyleSheet.create({
    cell: {
      width: CellStackSize,
      height: CellStackSize * 1.5,
      backgroundColor: 'white',
      borderColor: colors.primaryDark,
      borderWidth: BorderWidth,
      borderRadius: 10,
      elevation: 5,
      alignItems: 'center',
      justifyContent: 'center',
      margin: Offset,
    },
    cellPressed: {
      backgroundColor: colors.primaryDark,
      borderColor: colors.primary,
    },
    cellDisabled: {
      backgroundColor: colors.backgroundGray,
    },
    text: {
      color: colors.text,
      fontSize: CellStackSize * 0.8,
    },
    textPressed: {
      color: 'white',
    },
  });

export default StackCell;
