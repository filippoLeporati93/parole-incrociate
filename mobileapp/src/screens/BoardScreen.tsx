import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  LayoutAnimation,
  StyleSheet,
  View,
} from 'react-native';
import GameService, { IPlayMatrix } from '../services/GameService';


import {
  BoardWidth,
} from '../components/GlobalStyle';

import Grid from '../components/Grid';
import Stack from '../components/Stack';
import SocketService from '../services/SocketService';
import Timer from '../components/Timer';
import AcceptAction from '../components/AcceptAction';
import { useTheme } from 'react-native-paper';
import Text from '../components/AppText';

const BoardScreen = ({navigation}) => {
  const theme = useTheme();
  const [inited, setInitiated] = useState(false);
  const [solved, setIsSolved] = useState(false);
  const [cellIndexPressed, setCellIndexPressed] = useState({dx: -1, dy: -1});
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [gameStarted, setGameStarted] = useState(true);
  const [opponentLetter, setOpponentLetter] = useState("");
  const [showAcceptActionContainer, setShowActionContainer] = useState(false);
  
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
    if( matrix[dx][dy] === " ") {
      LayoutAnimation.easeInEaseOut();
      setCellIndexPressed({dx: dx, dy: dy});
    }
  }

  const onStackCellPress = (letter: string) => {
    if (cellIndexPressed.dx !== -1) {
      setShowActionContainer(true);
      setMatrix(matrix => {
          matrix[cellIndexPressed.dx][cellIndexPressed.dy] = letter;
          return matrix;
      });  
    }
  }

  const onAcceptPress = () => {
    setShowActionContainer(false);
    nextTurn(matrix[cellIndexPressed.dx][cellIndexPressed.dy])
  }

  const onCancelPress = () => {
    setShowActionContainer(false);
    setMatrix(matrix => {
      matrix[cellIndexPressed.dx][cellIndexPressed.dy] = " ";
      return matrix;
  });  
  }

  const nextTurn = (letter: string) => {
    setIsMyTurn(isMyTurn => !isMyTurn);
    if (SocketService.socket) {
        GameService.updateGame(SocketService.socket, cellIndexPressed, letter, opponentMatrix);
    }
  };

  const handleGameUpdate = () => {
    if (SocketService.socket) {
      GameService.onGameUpdate(SocketService.socket, async (opponentLetter, newOpponentMatrix) => {
        setIsMyTurn(isMyTurn => !isMyTurn);
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
      GameService.onStartGame(SocketService.socket, () => {
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
      <View style={styles.container}>
            <View style={styles.infoContainer}>
              <Timer />
            </View>
            <View style={styles.boardContainer} >
                <Grid 
                matrix={matrix} 
                cellIndexPressed={cellIndexPressed} 
                onCellPress={onCellPress}  />
            </View>
            { isMyTurn ? (
              <>
            <View style={styles.acceptActionContainer}>
              <AcceptAction
              show={showAcceptActionContainer}
              onAcceptPress={() => onAcceptPress()}
              onCancelPress={() => onCancelPress()}/>
            </View>
            <View style={styles.stackContainer}>
              <Stack onStackCellPress={onStackCellPress}  />
            </View></>) : (
          <View style={{flex:6, justifyContent: 'center', marginBottom: 40}}>
              <Text style={{fontSize: 20,textAlign: 'center', marginBottom: 10}}>
                Attendi il tuo prossimo turno...
              </Text>
              <ActivityIndicator 
              color={theme.colors.primaryDark} 
              size="large" />
          </View>
        )}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  stackContainer: {
    marginBottom: 40,
    flex: 5,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  boardContainer: {
    flex: 10,
    paddingTop: 10,
    alignItems: 'center',
    width: BoardWidth,
  },
  infoContainer: {
    flex: 1,
    width: BoardWidth,
    alignItems: 'center',
    justifyContent: 'flex-end',
    },
  acceptActionContainer: {
      flex: 1,
    },

});


export default BoardScreen;