import React, { Component, useContext, useEffect, useState } from 'react';

import {
  InteractionManager,
  LayoutAnimation,
  StyleSheet,
  Platform,
  View,
} from 'react-native';
import GameService, { IPlayMatrix } from '../services/GameService';

import {
  CellSize,
  BoardWidth,
  BorderWidth,
} from '../components/GlobalStyle';

import Grid from '../components/Grid';
import Stack from '../components/Stack';
import SocketService from '../services/SocketService';
import Timer from '../components/Timer';

const BoardScreen = ({navigation}) => {
  
  const [inited, setInitiated] = useState(false);
  const [solved, setIsSolved] = useState(false);
  const [cellIndexPressed, setCellIndexPressed] = useState({dx: -1, dy: -1});
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [gameStarted, setGameStarted] = useState(true);
  const [opponentLetter, setOpponentLetter] = useState("");
  
  const [matrix, setMatrix] = useState<IPlayMatrix>([
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
  ]);

  const [opponentMatrix, setOpponentMatrix] = useState<IPlayMatrix>([
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
  ]);


  const onCellPress = ({dx, dy} : {dx: number, dy: number}) => {
    if (inited || solved) return;
    if (dx !== cellIndexPressed.dx || dy !== cellIndexPressed.dy) {
      LayoutAnimation.easeInEaseOut();
      setCellIndexPressed({dx: dx, dy: dy});
    }
  }

  const onStackCellPress = (letter: string) => {
    if (cellIndexPressed.dx !== -1) {
        setMatrix(matrix => {
            matrix[cellIndexPressed.dx][cellIndexPressed.dy] = letter;
            return matrix;
        });
        nextTurn(letter);
    }
  }

  const nextTurn = (letter: string) => {
    setIsMyTurn(isMyTurn => !isMyTurn);
    if (SocketService.socket) {
      GameService.updateGame(SocketService.socket, cellIndexPressed, letter, opponentMatrix);
    }
  };

  const handleGameUpdate = () => {
    if (SocketService.socket) {
      setIsMyTurn(isMyTurn => !isMyTurn);
      GameService.onGameUpdate(SocketService.socket, async (opponentLetter, newOpponentMatrix) => {
        setMatrix(newOpponentMatrix);
        setOpponentLetter(opponentLetter);
        const [currentPlayerWon, otherPlayerWon] = await GameService.checkGame(matrix, newOpponentMatrix);
        if (SocketService.socket) {
          if (currentPlayerWon && otherPlayerWon) {
            GameService.gameFinish(SocketService.socket, "The Game is a TIE!");
          } else if (currentPlayerWon && !otherPlayerWon) {
            GameService.gameFinish(SocketService.socket, "You Win!");
          } else {
            GameService.gameFinish(SocketService.socket, "You Lost!")
          }
        }
      });
    }
  };

  const handleGameStart = () => {
    if (SocketService.socket)
      GameService.onStartGame(SocketService.socket, (options) => {
        setGameStarted(true);
      });
  };

  const handleGameFinish = () => {
    if (SocketService.socket)
      GameService.onGameFinish(SocketService.socket, (message) => {
        console.log("Here", message);
        setIsMyTurn(false);
      });
  };

  useEffect(() => {
    handleGameUpdate();
    handleGameStart();
    handleGameFinish();
  }, []);


    return (
      <View style={styles.container} >
        <View style={styles.infoContainer}>
          <Timer />
        </View>
        <View style={styles.boardContainer} >
            <Grid 
            matrix={matrix} 
            cellIndexPressed={cellIndexPressed} 
            onCellPress={onCellPress}  />
        </View>
        <View style={styles.stackContainer}>
          <Stack onStackCellPress={onStackCellPress}  />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    stackContainer: {
      justifyContent: 'flex-end',
      marginBottom: 50,
    },
    boardContainer: {
      flex:1,
      marginTop: 10,
      alignItems: 'center',
      width: BoardWidth,
    },
    infoContainer: {
      marginTop: 20,
      width: BoardWidth,
      marginHorizontal: 10,
      alignItems: 'center',
    }
});


export default BoardScreen;