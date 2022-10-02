import React, { Component } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import StackCell from './StackCell';

const stack = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

interface IStack {
  opponentLetter? : string,
  onStackCellPress: (letter: string) => void,
  stackLetterPressed?: string,
}

const Stack = ({opponentLetter, onStackCellPress, stackLetterPressed} : IStack) => {

  return (
      <View style={styles.container} >
      {
        stack.map((item, i) => (
              <StackCell 
              key={item} 
              letter={item} 
              onStackCellPress={onStackCellPress} 
              pressed={item === stackLetterPressed}
              isDisabled={opponentLetter !== "" && opponentLetter !== item ? true : false}
              />
            )
        )
      }
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});


export default Stack;