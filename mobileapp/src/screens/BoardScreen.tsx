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

const BoardScreen = () => {
  
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


  const onCellPress = (xIndex: number, yIndex: number) => {
    if (inited || solved) return;
    if (xIndex !== cellIndexPressed.dx || yIndex !== cellIndexPressed.dy) {
      LayoutAnimation.easeInEaseOut();
      setCellIndexPressed({dx: xIndex, dy: yIndex});
    }
  }

  const onStackCellPress = (letter: string) => {
    if (!inited) return;

    if (cellIndexPressed.dx == -1) {
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
        <View style={styles.boardContainer} >
          <View style={styles.board} >
            <Grid matrix={matrix} onCellPress={onCellPress}  />
          </View>
        </View>
        <Stack onStackCellPress={onStackCellPress}  />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
  boardContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: BoardWidth,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'orange',
    padding: BorderWidth,
  },
  row: {
    position: 'absolute',
    backgroundColor: 'transparent',
    margin: BorderWidth * 2,
    top: 0,
    left: 0,
    width: CellSize * 9 + BorderWidth * 4,
    height: CellSize,
    borderColor: 'peru',
    borderWidth: 2,
    borderRadius: BorderWidth,
  },
  column: {
    position: 'absolute',
    backgroundColor: 'transparent',
    margin: BorderWidth * 2,
    top: 0,
    left: 0,
    width: CellSize,
    height: CellSize * 9 + BorderWidth * 4,
    borderColor: 'peru',
    borderWidth: 2,
    borderRadius: BorderWidth,
  },
});


export default BoardScreen;