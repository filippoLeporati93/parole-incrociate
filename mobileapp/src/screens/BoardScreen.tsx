import React, { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  LayoutAnimation,
  StyleSheet,
  View,
} from 'react-native';
import gameServiceFactory, { IPlayMatrix } from '../services/GameServiceFactory';
import SocketService from "../services/SocketService";


import {
  BoardWidth,
} from '../components/GlobalStyle';

import Grid from '../components/Grid';
import Stack from '../components/Stack';
import Timer from '../components/Timer';
import AcceptAction from '../components/AcceptAction';
import { useTheme } from 'react-native-paper';
import Text from '../components/AppText';
import EndGameModal from '../components/modal/EndGameModal';
import EndGameDisconnectModal from '../components/modal/EndGameDisconnectModal';
import StatisticsUtils from '../utils/StatisticsUtils';
import { gameResults } from '../models/Types';

const BoardScreen = ({ route, navigation }) => {
  const theme = useTheme();

  const gameService = gameServiceFactory().build(route.params.isOnlineGame);

  const [endGameModalVisible, setEndGameModalVisible] = useState(false);
  const [endGameDisconnectModalVisible, setEndGameDisconnectModalVisible] = useState(false);

  const [endGameStatus, setEndGameStatus] = useState(-1);
  const [points, setPoints] = useState(-1);
  const tempGameResults : gameResults[] = [];
  const [gameResults, setGameResults] = useState<gameResults[]>([]);
  const [textHelp, setTextHelp] = useState("Posiziona una lettera sulla griglia");
  const [opponentLetter, setOpponentLetter] = useState("");
  const [cellIndexPressed, setCellIndexPressed] = useState({ dx: -1, dy: -1 });
  const [stackLetterPressed, setStackLetterPressed] = useState("");
  
  const [isMyTurn, setIsMyTurn] = useState(true);
  
  const [showAcceptActionContainer, setShowActionContainer] = useState(false);
  
  const timerRef = useRef<any>(null);
  const elapsedTimer = useRef<number>(0);

  const [matrix, setMatrix] = useState<IPlayMatrix>([
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
  ]);

  useEffect(() => {
    // start game with computer
    if(route.params.level !== -1)
      gameService.onStartGame(() => {});
      
    // call only for online game
    if(route.params.level === -1) {
      setIsMyTurn(route.params.start)
      gameService.onGameFinish(handleOnGameFinish);
      gameService.onUpdateGame(handleOnUpdateGame);
      gameService.onPlayerLeaving(handleOnPlayersLeaving)
    }

    return () => {
      SocketService.disconnect().catch( e => console.log(e))
    }
  }, [])



  const isGridComplete = (grid: IPlayMatrix) => {
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            if (grid[i][j] === " ") {
                return false
            }
        }
    }
    return true;
  }


  const onCellPress = ({ dx, dy }: { dx: number, dy: number }) => {
    if (showAcceptActionContainer)
      return;
    if (matrix[dx][dy] === " ") {
      LayoutAnimation.easeInEaseOut();
      setCellIndexPressed({ dx: dx, dy: dy });
    }
    if (stackLetterPressed !== "") {
      setMatrix(matrix => {
        matrix[dx][dy] = stackLetterPressed;
        return matrix;
      });
      setShowActionContainer(true);
      setStackLetterPressed("");
    }
  }

  const onStackCellPress = (letter: string) => {
    if (cellIndexPressed.dx !== -1) {
      setShowActionContainer(true);
      setMatrix(matrix => {
        matrix[cellIndexPressed.dx][cellIndexPressed.dy] = letter;
        return matrix;
      });
    } else {
      setStackLetterPressed(letter);
    }
  }

  const onAcceptPress = () => {
    setShowActionContainer(false);
    if(opponentLetter !== "") {
      setOpponentLetter("");
      setTextHelp("Posiziona la prossima lettera");
      setCellIndexPressed({dx: -1, dy: -1})
      return;
    }
    nextTurn(matrix[cellIndexPressed.dx][cellIndexPressed.dy])
  }

  const onCancelPress = () => {
    setShowActionContainer(false);
    setMatrix(matrix => {
      matrix[cellIndexPressed.dx][cellIndexPressed.dy] = " ";
      return matrix;
    });
    setStackLetterPressed("");
    setCellIndexPressed({dx:-1,dy:-1})
  }

  const nextTurn = (letter: string) => {
    setIsMyTurn(false);
    if(isGridComplete(matrix)) {
      timerRef.current.stop();
      gameService.gameFinish(matrix, (myResult) => tempGameResults.push(myResult));
    }
    gameService.updateGame(route.params.level, letter, () => {
      if(route.params.level !== -1) {
        gameService.onUpdateGame(handleOnUpdateGame)
      }
    });

  };

  const handleOnUpdateGame = (opponentLetter: string) => {
    // place the letter of the opponent
    setCellIndexPressed({ dx: -1, dy: -1 });
    setIsMyTurn(true);
    setTextHelp("Posiziona la lettera " + opponentLetter + ", scelta dall'avversario")
    setOpponentLetter(opponentLetter);
    // if you are playing against computer and opponent has no more letter to put, ask for opponent grid results.
    if(opponentLetter === "" && route.params.level !== -1)
      gameService.onGameFinish(handleOnGameFinish);
  }


  // add opponents results since the have no more letter to put
  const handleOnGameFinish = (opponentResult: gameResults) => {
    tempGameResults.push(opponentResult);
    if(tempGameResults.length === 2)
      showModalResults();
  }

  const handleOnPlayersLeaving = (playersRemaining? : number) => {
    if(playersRemaining && playersRemaining <= 0)
      setEndGameDisconnectModalVisible(true);
  }

  const showModalResults = () => {
      setGameResults(tempGameResults);
      const personalPoints = tempGameResults.filter(e => e.isOpponent === false)[0].points
      setPoints(personalPoints);
      const opponentPoints = tempGameResults.filter(e => e.isOpponent === true)[0].points
      if (personalPoints > opponentPoints)
      setEndGameStatus(1);
      else if (personalPoints === opponentPoints)
      setEndGameStatus(0);
      else
      setEndGameStatus(-1);
      
      setEndGameModalVisible(true);
            
      StatisticsUtils.addGame({
          youWon: personalPoints > opponentPoints,
          score: personalPoints,
          gameDatetime: new Date(),
          level: route.params.level,
          gameElapsedTime: elapsedTimer.current,
      });
  }

    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={{flex: 1, alignItems:'center'}}>
            <Text textType='light' style={styles.textInfo}>Livello</Text>
            <Text textType='bold' style={styles.textInfo}>{route.params.levelDesc}</Text>
          </View>
        <View style={{flex: 1, alignItems:'center'}}>
          <Timer  ref={timerRef} onStop={_seconds => elapsedTimer.current = _seconds} />
          </View>
        </View>
        <View style={styles.boardContainer} >
          <Grid
            matrix={matrix}
            cellIndexPressed={cellIndexPressed}
            onCellPress={onCellPress} />
        </View>
        {isMyTurn ? (
          <>
          {showAcceptActionContainer ? (
            <View style={styles.acceptActionContainer}>
              <AcceptAction
                onAcceptPress={() => onAcceptPress()}
                onCancelPress={() => onCancelPress()} />
            </View>
          ) : (  
            <View style={styles.stackContainer}>
              <Text style={styles.textHelp}>{textHelp}</Text>
              <Stack opponentLetter={opponentLetter} onStackCellPress={onStackCellPress} stackLetterPressed={stackLetterPressed} />
            </View>
          )}
          </>
        ) : (
          <View style={{ flex: 5, justifyContent: 'center', marginBottom: 40,}}>
            <Text style={{ fontSize: 20, textAlign: 'center' }}>
              Attendi il tuo prossimo turno...
            </Text>
            <ActivityIndicator
              color={theme.colors.primaryDark}
              size="large" />
          </View>
        )}
      
      <EndGameModal 
        endGameStatus={endGameStatus}
        points={points}
        isVisible={endGameModalVisible} 
        onPress={() => {
            setEndGameModalVisible(false);
            navigation.popToTop();
          }
        }
        onGameDetailPress={() => {
          setEndGameModalVisible(false);
          navigation.replace("ScoreScreen", {results: gameResults} );
        }}
      />

      <EndGameDisconnectModal 
        isVisible={endGameDisconnectModalVisible} 
        onBackPress={() => {
            setEndGameDisconnectModalVisible(false);
            navigation.popToTop();
          }
        }
      />

      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackContainer: {
    marginBottom: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal:20,
  },
  acceptActionContainer: {
    marginBottom: 10,
    flex: 5,
    justifyContent: 'center',
  },
  textHelp: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
  },
  textInfo: {
    fontSize: 13,
    color: 'gray',
  },

});


export default BoardScreen;