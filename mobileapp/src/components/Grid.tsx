import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import {
  CellSize,
  BorderWidth,
} from './GlobalStyle';

import Cell from './Cell';
import { useTheme } from 'react-native-paper';

interface IGrid {
  matrix: Array<Array<string>>,
  cellIndexPressed: {dx: number, dy: number},
  onCellPress: (location: {dx: number, dy: number}) => void
}

const Grid = ({matrix, cellIndexPressed, onCellPress} : IGrid) => {
    const theme = useTheme();
    const styles = makeStyles(theme.colors);

    return (
        <View style={styles.container} >
        {
        matrix.map((item: string[], i: number) => {
            return (
            <View key={'grid' + i} style={styles.grid} >
            {
            
                item.map((item: string, j: number) => (
                        <Cell 
                            key={i + j} 
                            location={{dx:j, dy:i}} 
                            pressed={ j === cellIndexPressed.dx && i === cellIndexPressed.dy ? true : false}
                            letter={item} 
                            onCellPress={onCellPress} 
                        />
                    ))
            }
            </View>
            )
        })
        }
        </View>
    );
  
}

const makeStyles = (color) => StyleSheet.create({
  container: {
    width: CellSize * 5 + StyleSheet.hairlineWidth * 2 + 4,
    height: CellSize * 5 +  StyleSheet.hairlineWidth * 2 + 4,
    flexDirection: 'column',
    borderWidth: 2,
    borderColor: color.primaryDark,
  },
  grid: {
    flexDirection: 'row',
  },
});


export default Grid;