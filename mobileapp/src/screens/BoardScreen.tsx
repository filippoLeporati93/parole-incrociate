import React, { useEffect, useState } from 'react';

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

const BoardScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const [initiated, setInitiated] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [textHelp, setTextHelp] = useState("Posiziona una lettera sulla griglia");
  const [opponentLetter, setOpponentLetter] = useState("");
  const [cellIndexPressed, setCellIndexPressed] = useState({ dx: -1, dy: -1 });
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [showAcceptActionContainer, setShowActionContainer] = useState(false);

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


  const onCellPress = ({ dx, dy }: { dx: number, dy: number }) => {
    if (showAcceptActionContainer)
      return;
    if (matrix[dy][dx] === " ") {
      LayoutAnimation.easeInEaseOut();
      setCellIndexPressed({ dx: dx, dy: dy });
    }
  }

  const onStackCellPress = (letter: string) => {
    if (cellIndexPressed.dx !== -1) {
      setShowActionContainer(true);
      setMatrix(matrix => {
        matrix[cellIndexPressed.dy][cellIndexPressed.dx] = letter;
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
    nextTurn(matrix[cellIndexPressed.dy][cellIndexPressed.dx])
  }

  const onCancelPress = () => {
    setShowActionContainer(false);
    setMatrix(matrix => {
      matrix[cellIndexPressed.dy][cellIndexPressed.dx] = " ";
      return matrix;
    });
  }

  const nextTurn = (letter: string) => {
    setIsMyTurn(isMyTurn => !isMyTurn);
    gameService.updateGame(cellIndexPressed, letter, (opponentLetter, isGridCompleted) => {
      if(isGridCompleted) {
        gameService.gameFinish(matrix, onGameFinish);
        return;
      }
      console.log(opponentLetter)
      setCellIndexPressed({ dx: -1, dy: -1 });
      setIsMyTurn(isMyTurn => !isMyTurn);
      setTextHelp("Posiziona la lettera " + opponentLetter + ", scelta dall'avversario")
      setOpponentLetter(opponentLetter);
    });
  };

  const onGameFinish = (results: any[]) => {
    console.log(results);
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
          <Timer />
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