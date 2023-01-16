import React, {useCallback} from 'react';

import {StyleSheet, View} from 'react-native';

import Cell from './Cell';
import {useTheme} from 'react-native-paper';
import {wordResults} from '../models/Types';
import {Matrix} from '../services/GameEngine';
import {BoardWidth, CellSize} from './GlobalStyle';

interface IGrid {
  matrix: Matrix;
  cellIndexPressed?: {dx: number; dy: number};
  wordPressed?: wordResults;
  onCellPress?: (location: {dx: number; dy: number}) => void;
  cellSize?: number;
}

const Grid = ({
  matrix,
  cellIndexPressed,
  wordPressed,
  onCellPress,
  cellSize,
}: IGrid) => {
  const theme = useTheme();
  const cellSizeCustom = cellSize ?? CellSize;

  const styles = makeStyles(theme.colors, cellSizeCustom);

  const isPressed = useCallback(
    (dx: number, dy: number): boolean => {
      if (cellIndexPressed) {
        return dx === cellIndexPressed.dx && dy === cellIndexPressed.dy
          ? true
          : false;
      }
      if (wordPressed) {
        if (wordPressed.direction === 'dx') {
          return (
            dx === wordPressed.location[0] &&
            dy < wordPressed.location[1] + wordPressed.word.length &&
            dy >= wordPressed.location[1]
          );
        } else {
          return (
            dy === wordPressed.location[1] &&
            dx < wordPressed.location[0] + wordPressed.word.length &&
            dx >= wordPressed.location[0]
          );
        }
      }

      return false;
    },
    [cellIndexPressed, wordPressed]
  );

  return (
    <View style={styles.container}>
      {matrix.map((itemCol: string[], i: number) => {
        return (
          <View key={'grid' + i} style={styles.grid}>
            {itemCol.map((itemRow: string, j: number) => (
              <Cell
                key={i + j}
                location={{dx: i, dy: j}}
                pressed={isPressed(i, j)}
                letter={itemRow}
                onCellPress={onCellPress}
                cellSize={cellSizeCustom}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
};

const makeStyles = (color, cellSizeCustom) =>
  StyleSheet.create({
    container: {
      width: cellSizeCustom * 5 + StyleSheet.hairlineWidth * 2 + 4,
      height: cellSizeCustom * 5 + StyleSheet.hairlineWidth * 2 + 4,
      flexDirection: 'column',
      borderWidth: 2,
      borderColor: color.primaryDark,
    },
    grid: {
      flexDirection: 'row',
    },
  });

export default Grid;
