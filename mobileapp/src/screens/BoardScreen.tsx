import React, { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  LayoutAnimation,
  StyleSheet,
  View,
} from 'react-native';
import gameServiceFactory, { IPlayMatrix } from '../services/GameServiceFactory';


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
import StatisticsUtils from '../utils/StatisticsUtils';

const BoardScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const [initiated, setInitiated] = useState(false);
  const [endGameModalVisible, setEndGameModalVisible] = useState(false);
  const [endGameStatus, setEndGameStatus] = useState(-1);
  const [points, setPoints] = useState(-1);
  const [gameResults, setGameResults] = useState({});
  const [textHelp, setTextHelp] = useState("Posiziona una lettera sulla griglia");
  const [opponentLetter, setOpponentLetter] = useState("");
  const [cellIndexPressed, setCellIndexPressed] = useState({ dx: -1, dy: -1 });
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [showAcceptActionContainer, setShowActionContainer] = useState(false);
  
  const timerRef = useRef<any>(null);
  const elapsedTimer = useRef<number>(0);

  const gameService = gameServiceFactory().build(route.params.isOnlineGame);

  const [matrix, setMatrix] = useState<IPlayMatrix>([
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " "],
  ]);

  useEffect(() => {
    gameService.onStartGame(() => {
      setInitiated(true);
    });
  }, []);

  const isGridComplete = (matrix: IPlayMatrix): boolean => {
    for(let i = 0; i < matrix.length; i++) {
      for(let j = 0; j < matrix[i].length; j++){
          if (matrix[i][j] === " ") {
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
  }

  const nextTurn = (letter: string) => {
    setIsMyTurn(isMyTurn => !isMyTurn);
    gameService.updateGame(cellIndexPressed, letter, (opponentLetter, isOpponentGridCompleted) => {
      if(isOpponentGridCompleted) {
        timerRef.current.stop();
        gameService.gameFinish(matrix, onGameFinish);
        return;
      }
      setCellIndexPressed({ dx: -1, dy: -1 });
      setIsMyTurn(isMyTurn => !isMyTurn);
      setTextHelp("Posiziona la lettera " + opponentLetter + ", scelta dall'avversario")
      setOpponentLetter(opponentLetter);
    });
  };

  const onGameFinish = (results: any[]) => {
    setIsMyTurn(isMyTurn => !isMyTurn);
    const resultsValue = results.map((v) => {
      if (v.status === 'fulfilled') return v.value
    });
    setGameResults(resultsValue);
    const personalPoints = resultsValue.filter(e => e.isOpponent === false)[0].points
    setPoints(personalPoints);
    const opponentPoints = resultsValue.filter(e => e.isOpponent === true)[0].points
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

  if (!initiated) {
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center'}}>
        <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 10 }}>
          La partita sta per cominciare...
        </Text>
        <ActivityIndicator
          color={theme.colors.primaryDark}
          size="large" />
      </View>
    </View>
  } else {

    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Timer ref={timerRef} onStop={_seconds => elapsedTimer.current = _seconds} />
        </View>
        <View style={styles.boardContainer} >
          <Grid
            matrix={matrix}
            cellIndexPressed={cellIndexPressed}
            onCellPress={onCellPress} />
        </View>
        {isMyTurn ? (
          <>
            <View style={styles.acceptActionContainer}>
              <AcceptAction
                show={showAcceptActionContainer}
                onAcceptPress={() => onAcceptPress()}
                onCancelPress={() => onCancelPress()} />
            </View>
            <View style={styles.stackContainer}>
              <Stack opponentLetter={opponentLetter} onStackCellPress={onStackCellPress} />
            </View>
            <View style={styles.textHelpContainer}>
              <Text style={{color: 'gray', fontSize: 11,}}>{textHelp}</Text>
            </View>
          </>
        ) : (
          <View style={{ flex: 6, justifyContent: 'center', marginBottom: 40 }}>
            <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 10, }}>
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

      </View>
    );
  }
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
    width: BoardWidth,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  acceptActionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textHelpContainer: {
    alignItems: 'center',
    marginBottom: 20,
  }

});


export default BoardScreen;