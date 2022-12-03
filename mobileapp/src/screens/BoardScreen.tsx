import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';

import {
  ActivityIndicator,
  Alert,
  BackHandler,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import gameServiceFactory, {IPlayMatrix} from '../services/GameServiceFactory';
import SocketService from '../services/SocketService';

import {BoardWidth} from '../components/GlobalStyle';

import Grid from '../components/Grid';
import Stack, {ALPHABET} from '../components/Stack';
import Timer from '../components/Timer';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import AcceptAction from '../components/AcceptAction';
import {useTheme} from 'react-native-paper';
import Text from '../components/AppText';
import EndGameModal from '../components/modal/EndGameModal';
import EndGameDisconnectModal from '../components/modal/EndGameDisconnectModal';
import StatisticsUtils from '../utils/StatisticsUtils';
import {gameResults} from '../models/Types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import {useFocusEffect} from '@react-navigation/native';

const BoardScreen = ({route, navigation}) => {
  const theme = useTheme();

  const gameService = useMemo(
    () => gameServiceFactory().build(route.params.isOnlineGame),
    [route.params.isOnlineGame]
  );

  const roomId = route.params.roomId;
  const roomUsers: string[] = route.params.roomUsers;

  const [endGameModalVisible, setEndGameModalVisible] = useState(false);
  const [endGameDisconnectModalVisible, setEndGameDisconnectModalVisible] =
    useState(false);

  const [endGameStatus, setEndGameStatus] = useState(-1);
  const [points, setPoints] = useState(-1);
  const [tempGameResults, setTempGameResults] = useState<gameResults[]>([]);
  const [gameResults, setGameResults] = useState<gameResults[]>([]);
  const [textHelp, setTextHelp] = useState(
    'Posiziona una lettera sulla griglia'
  );
  const [opponentLetter, setOpponentLetter] = useState('');
  const [cellIndexPressed, setCellIndexPressed] = useState({dx: -1, dy: -1});
  const [stackLetterPressed, setStackLetterPressed] = useState('');

  const [isMyTurn, setIsMyTurn] = useState(true);

  const [showAcceptActionContainer, setShowActionContainer] = useState(false);

  const timerRef = useRef<any>(null);
  const elapsedTimer = useRef<number>(0);
  const REMAINING_GAME_TIME = 20;
  const [countdownKey, setCountdownKey] = useState(0);
  const [timeIsUpMessage, setTimeIsUpMessage] = useState('');

  const [matrix, setMatrix] = useState<IPlayMatrix>([
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
  ]);

  useKeepAwake();

  const isGridComplete = useCallback((grid: IPlayMatrix) => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === ' ') {
          return false;
        }
      }
    }
    return true;
  }, []);

  const getRandomEmptyPosition = useCallback((grid: IPlayMatrix) => {
    const emptyPositions: Array<{i: number; j: number}> = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === ' ') {
          emptyPositions.push({i, j});
        }
      }
    }
    if (emptyPositions.length > 0) {
      return emptyPositions[Math.floor(emptyPositions.length * Math.random())];
    } else {
      return {i: -1, j: -1};
    }
  }, []);

  // add opponents results since the have no more letter to put
  const handleOnGameFinish = useCallback((opponentResult: gameResults) => {
    setTempGameResults(prevList => [...prevList, opponentResult]);
  }, []);

  const handleOnPlayerLeaving = useCallback(
    (userID: string) => {
      if (roomUsers.includes(userID)) {
        setEndGameDisconnectModalVisible(true);
      }
    },
    [roomUsers]
  );

  const handleOnUpdateGame = useCallback(
    (opLetter: string) => {
      // if you are playing against computer and opponent has no more letter to put, ask for opponent grid results.
      if (opLetter === '' && route.params.level !== -1) {
        gameService.onGameFinish(handleOnGameFinish);
      }
      if (!isGridComplete(matrix)) {
        // place the letter of the opponent
        setCellIndexPressed({dx: -1, dy: -1});
        setIsMyTurn(true);
        setCountdownKey(prevKey => prevKey + 1);
        setTextHelp(
          'Posiziona la lettera ' + opLetter + ", scelta dall'avversario"
        );
        setOpponentLetter(opLetter);
      }
    },
    [
      gameService,
      handleOnGameFinish,
      isGridComplete,
      matrix,
      route.params.level,
    ]
  );

  const showModalResults = useCallback(() => {
    setGameResults(tempGameResults);
    const personalResult = tempGameResults.filter(
      e => e.isOpponent === false
    )[0];
    if (!personalResult) {
      return;
    }
    const personalPoints = personalResult.points;
    setPoints(personalPoints);
    const opponentResult = tempGameResults.filter(
      e => e.isOpponent === true
    )[0];
    if (!opponentResult) {
      return;
    }
    const opponentPoints = opponentResult.points;
    if (personalPoints > opponentPoints) {
      setEndGameStatus(1);
    } else if (personalPoints === opponentPoints) {
      setEndGameStatus(0);
    } else {
      setEndGameStatus(-1);
    }

    setEndGameModalVisible(true);

    StatisticsUtils.addGame({
      youWon: personalPoints > opponentPoints,
      score: personalPoints,
      gameDatetime: new Date(),
      level: route.params.level,
      gameElapsedTime: elapsedTimer.current,
    });
  }, [route.params.level, tempGameResults]);

  const nextTurn = useCallback(() => {
    setShowActionContainer(false);
    const _isGridComplete = isGridComplete(matrix);
    // opponentLetter has been placed and grid is not complete -> add the next letter
    if (opponentLetter !== '' && !_isGridComplete) {
      setOpponentLetter('');
      setTextHelp('Posiziona la prossima lettera');
      setCellIndexPressed({dx: -1, dy: -1});
      setCountdownKey(prevKey => prevKey + 1);
      return;
      // opponent letter has been placed and grid is complete --> send game finish and stop
    } else if (opponentLetter !== '' && _isGridComplete) {
      setIsMyTurn(false);
      timerRef.current.stop();
      gameService.gameFinish(
        matrix,
        myResult => setTempGameResults(prevList => [...prevList, myResult]),
        roomId
      );
      // personal letter placed
    } else if (opponentLetter === '') {
      const letter = matrix[cellIndexPressed.dx][cellIndexPressed.dy];
      setIsMyTurn(false);
      // grid is complete --> send game finish
      if (_isGridComplete) {
        timerRef.current.stop();
        gameService.gameFinish(
          matrix,
          myResult => setTempGameResults(prevList => [...prevList, myResult]),
          roomId
        );
      }
      // send your placed letter
      gameService.updateGame(
        route.params.level,
        letter,
        () => {
          if (route.params.level !== -1) {
            gameService.onUpdateGame(handleOnUpdateGame);
          }
        },
        roomId
      );
    }
  }, [
    cellIndexPressed.dx,
    cellIndexPressed.dy,
    gameService,
    handleOnUpdateGame,
    isGridComplete,
    matrix,
    opponentLetter,
    roomId,
    route.params.level,
  ]);

  useEffect(() => {
    // start game with computer
    if (route.params.level !== -1) {
      gameService.onStartGame(() => {});
    }

    // call only for online game
    if (route.params.level === -1) {
      let offGameFinish = () => {};
      let offUpdateGame = () => {};
      let offPlayerLeaving = () => {};
      setIsMyTurn(route.params.start);
      offGameFinish = gameService.onGameFinish(handleOnGameFinish);
      offUpdateGame = gameService.onUpdateGame(handleOnUpdateGame);
      offPlayerLeaving = gameService.onPlayerLeaving(handleOnPlayerLeaving);

      return () => {
        offGameFinish();
        offUpdateGame();
        offPlayerLeaving();
      };
    }
  }, [
    gameService,
    handleOnGameFinish,
    handleOnPlayerLeaving,
    handleOnUpdateGame,
    route.params.level,
    route.params.start,
  ]);

  useEffect(() => {
    let fnTimeout: any = null;
    if (timeIsUpMessage !== '') {
      fnTimeout = setTimeout(() => {
        setTimeIsUpMessage('');
        nextTurn();
      }, 2500);
    }
    return () => clearTimeout(fnTimeout);
  }, [nextTurn, timeIsUpMessage]);

  useEffect(() => {
    if (tempGameResults.length === 2) {
      showModalResults();
    }
  }, [showModalResults, tempGameResults.length]);

  const showBackAlert = useCallback(
    () =>
      // Prompt the user before leaving the screen
      Alert.alert(
        'Abbandoni la partita?',
        'Il gioco verrà interrotto e non potrai riprenderlo. Sei sicuro?',
        [
          {text: 'Rimani', style: 'cancel', onPress: () => {}},
          {
            text: 'Abbandona',
            style: 'destructive',
            // If the user confirmed, then we dispatch the action we blocked earlier
            // This will continue the action that had triggered the removal of the screen
            onPress: () => {
              SocketService.disconnect().then(navigation.goBack());
            },
          },
        ]
      ),
    [navigation]
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // if other player is disconnected or game ended go back
        // else show alert
        if (endGameDisconnectModalVisible || endGameModalVisible) {
          return false;
        } else {
          showBackAlert();
          return true;
        }
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [endGameDisconnectModalVisible, endGameModalVisible, showBackAlert])
  );

  const onTimeIsUp = useCallback(() => {
    setStackLetterPressed('');
    // if user has already selected something move forward, not changing letter and position
    if (
      cellIndexPressed.dx !== -1 &&
      matrix[cellIndexPressed.dx][cellIndexPressed.dy] !== ' '
    ) {
      setTimeIsUpMessage('Abbiamo confermato la tua scelta');
      return;
    }
    let letter: string = '';
    const {i, j} = getRandomEmptyPosition(matrix);
    setCellIndexPressed({dx: i, dy: j});
    if (opponentLetter !== '') {
      letter = opponentLetter;
      setTimeIsUpMessage('La lettera è stata inserita automaticamente');
    } else {
      letter = ALPHABET[Math.floor(ALPHABET.length * Math.random())];
      setTimeIsUpMessage('Abbiamo posizionato una lettera a caso');
    }
    setMatrix(m => {
      m[i][j] = letter;
      return m;
    });
  }, [
    cellIndexPressed.dx,
    cellIndexPressed.dy,
    getRandomEmptyPosition,
    matrix,
    opponentLetter,
  ]);

  const onCellPress = useCallback(
    ({dx, dy}: {dx: number; dy: number}) => {
      if (showAcceptActionContainer || matrix[dx][dy] !== ' ') {
        return;
      }
      if (matrix[dx][dy] === ' ') {
        LayoutAnimation.easeInEaseOut();
        setCellIndexPressed({dx: dx, dy: dy});
      }
      if (stackLetterPressed !== '') {
        setMatrix(m => {
          m[dx][dy] = stackLetterPressed;
          return m;
        });
        setShowActionContainer(true);
        setStackLetterPressed('');
      }
    },
    [matrix, showAcceptActionContainer, stackLetterPressed]
  );

  const onStackCellPress = useCallback(
    (letter: string) => {
      if (cellIndexPressed.dx !== -1) {
        setShowActionContainer(true);
        setMatrix(m => {
          m[cellIndexPressed.dx][cellIndexPressed.dy] = letter;
          return m;
        });
      } else {
        setStackLetterPressed(letter);
      }
    },
    [cellIndexPressed.dx, cellIndexPressed.dy]
  );

  const onCancelPress = useCallback(() => {
    setShowActionContainer(false);
    setMatrix(m => {
      m[cellIndexPressed.dx][cellIndexPressed.dy] = ' ';
      return m;
    });
    setStackLetterPressed('');
    setCellIndexPressed({dx: -1, dy: -1});
  }, [cellIndexPressed.dx, cellIndexPressed.dy]);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          // if other player is disconnected or game ended go back
          // else show alert
          if (endGameDisconnectModalVisible || endGameModalVisible) {
            SocketService.disconnect().then(navigation.goBack());
          } else {
            showBackAlert();
          }
        }}
        style={{
          paddingHorizontal: 15,
          paddingTop: Platform.OS === 'ios' ? 30 : 15,
        }}
      >
        <Icon name={'close'} size={25} color={theme.colors.text} />
      </Pressable>
      <View style={styles.boardContainer}>
        <View style={styles.infoContainer}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text textType="light" style={styles.textInfo}>
              Livello
            </Text>
            <Text textType="bold" style={styles.textInfo}>
              {route.params.levelDesc}
            </Text>
          </View>
          <CountdownCircleTimer
            key={countdownKey}
            isPlaying={isMyTurn}
            duration={REMAINING_GAME_TIME}
            size={38}
            strokeWidth={5}
            onComplete={() => onTimeIsUp()}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[20, 15, 10, 0]}
          >
            {({remainingTime}) => <Text>{remainingTime}</Text>}
          </CountdownCircleTimer>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Timer
              ref={timerRef}
              onStop={_seconds => (elapsedTimer.current = _seconds)}
            />
          </View>
        </View>
        <Grid
          matrix={matrix}
          cellIndexPressed={cellIndexPressed}
          onCellPress={onCellPress}
        />
      </View>
      {timeIsUpMessage !== '' ? (
        <View style={styles.stackContainer}>
          <Icon
            name="clock-alert-outline"
            size={30}
            color={theme.colors.primaryDark}
          />
          <Text textType="bold" style={{fontSize: 20, textAlign: 'center'}}>
            Tempo scaduto!
          </Text>
          <Text textType="light" style={{fontSize: 18, textAlign: 'center'}}>
            {timeIsUpMessage}
          </Text>
        </View>
      ) : isMyTurn ? (
        <>
          {showAcceptActionContainer ? (
            <View style={styles.acceptActionContainer}>
              <AcceptAction
                onAcceptPress={() => nextTurn()}
                onCancelPress={() => onCancelPress()}
              />
            </View>
          ) : (
            <View style={styles.stackContainer}>
              <Text style={styles.textHelp}>{textHelp}</Text>
              <Stack
                opponentLetter={opponentLetter}
                onStackCellPress={onStackCellPress}
                stackLetterPressed={stackLetterPressed}
              />
            </View>
          )}
        </>
      ) : (
        <View style={styles.stackContainer}>
          <Text textType="bold" style={{fontSize: 20, textAlign: 'center'}}>
            Attendi il tuo prossimo turno
          </Text>
          <Text
            textType="light"
            style={{fontSize: 18, textAlign: 'center', marginBottom: 10}}
          >
            L'avversario sta giocando...
          </Text>
          <ActivityIndicator color={theme.colors.primaryDark} size="small" />
        </View>
      )}

      <EndGameModal
        endGameStatus={endGameStatus}
        points={points}
        isVisible={endGameModalVisible}
        onPress={() => {
          setEndGameModalVisible(false);
          navigation.goBack();
        }}
        onGameDetailPress={() => {
          setEndGameModalVisible(false);
          navigation.replace('ScoreScreen', {results: gameResults});
        }}
      />

      <EndGameDisconnectModal
        isVisible={endGameDisconnectModalVisible}
        onBackPress={() => {
          setEndGameDisconnectModalVisible(false);
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackContainer: {
    flex: 2,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    width: BoardWidth,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 5,
  },
  acceptActionContainer: {
    flex: 2,
    alignItems: 'center',
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
