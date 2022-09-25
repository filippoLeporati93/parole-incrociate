import React from 'react';

import {
  StyleSheet,
  View} from 'react-native';

import {
  CellSize,
} from './GlobalStyle';

import Cell from './Cell';
import { useTheme } from 'react-native-paper';
import { wordResults } from '../models/Types';
import { IPlayMatrix } from '../services/GameServiceFactory';

interface IGrid {
  matrix: IPlayMatrix,
  cellIndexPressed?: {dx: number, dy: number},
  wordPressed?: wordResults,
  onCellPress?: (location: {dx: number, dy: number}) => void
}

const Grid = ({matrix, cellIndexPressed, wordPressed, onCellPress} : IGrid) => {
    const theme = useTheme();
    const styles = makeStyles(theme.colors);
    
    const isPressed = (dx:number, dy: number): boolean => {
      if (cellIndexPressed)
        return dx === cellIndexPressed.dx && dy === cellIndexPressed.dy ? true : false
      if (wordPressed) {
        if(wordPressed.direction === "dx") 
          return dx === wordPressed.location[0]
            && dy < wordPressed.location[1] + wordPressed.word.length 
            && dy >= wordPressed.location[1]
        else {
          console.log(wordPressed)
          return dy === wordPressed.location[1] 
            && dx < wordPressed.location[0] + wordPressed.word.length 
            && dx >= wordPressed.location[0]
        }
          
      }
        
      return false;
    }
    
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
                            location={{dx:i, dy:j}} 
                            pressed={isPressed(i ,j)}
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