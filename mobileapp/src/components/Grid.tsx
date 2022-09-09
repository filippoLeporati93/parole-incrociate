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

interface IGrid {
  matrix: Array<Array<string>>,
  onCellPress: (xIndex: number, yIndex: number) => void,
}

const Grid = ({matrix, onCellPress} : IGrid) => {
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
                            xIndex={j} 
                            yIndex={i}
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

const styles = StyleSheet.create({
  container: {
    width: CellSize * 5 + StyleSheet.hairlineWidth * 2 + 4,
    height: CellSize * 5 +  StyleSheet.hairlineWidth * 2 + 4,
    flexDirection: 'column',
    borderWidth: 2,
  },
  grid: {
    flexDirection: 'row',
  },
});


export default Grid;