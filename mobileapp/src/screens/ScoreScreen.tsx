import React, { useState } from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScrollView } from 'react-native-gesture-handler';
import Grid from '../components/Grid';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../components/AppText';
import { gameResults, wordResults } from '../models/Types';
import { useTheme } from 'react-native-paper';
import { CellSize } from '../components/GlobalStyle';

const Tab = createMaterialTopTabNavigator();

type wordLine = {
  wordResults: wordResults,
  onPressWord: (wordPressed: wordResults) => void,
}

const WordLine: React.FC<wordLine> = props => {
  return (
    <View style={{marginHorizontal: 30,}}>
      <Pressable
        onPress={() => props.onPressWord(props.wordResults)}
        style={{flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 8,
          }}>
        <View style={{flex: 1,}}>
        <Text style={{fontSize: 23}}>
          {props.wordResults.word}
        </Text>
        </View>
        <View style={{flex: 1,}}>
          <Text textType='light' style={{color: 'gray', textAlign: 'right'}}>{props.wordResults.word.length} punti</Text>
        </View>
        
        
      </Pressable>
      <View style={{borderWidth: StyleSheet.hairlineWidth, borderColor: 'gray'}}/>
    </View>
  )
}

type TabScoreProps = {
  result: gameResults,  
  wordPressed?: wordResults,
  onPressWord: (wordPressed: wordResults) => void,
}

export const TabScore: React.FC<TabScoreProps> = props => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        <Grid 
        matrix={props.result.matrix} 
        wordPressed={props.wordPressed}
        cellSize={CellSize * 0.65}
        />
      </View>
    <View style={styles.pointsContainer}>
      <Text style={{fontSize: 14, textAlign:'center', color:'gray'}}>Punteggio</Text>
      <Text textType='bold' style={{fontSize: 30, textAlign:'center'}}>{props.result.points}</Text>
    </View>
    <View style={styles.wordContainer}>
    <ScrollView>
      <Text style={{fontSize: 15, textAlign:'left', color:'gray',marginLeft: 30, marginTop: 20}}>Parole in riga</Text>
      {
        props.result.words
        .filter(w => w.direction == 'dx')
        .sort((a,b) => a.location[0]-b.location[0])
        .map((e,idx) => 
          <WordLine onPressWord={props.onPressWord} key={idx} wordResults={e} />
        )
      }
      <Text style={{fontSize: 15, textAlign:'left', color:'gray', marginTop: 20, marginLeft: 30}}>Parole in colonna</Text>
      {
        props.result.words
        .filter(w => w.direction == 'dy')
        .sort((a,b) => a.location[1]-b.location[1])
        .map((e,idx) => 
          <WordLine onPressWord={props.onPressWord} key={idx+100} wordResults={e} />
        )
      }
    </ScrollView>
    </View>
    </View>
  );

}

const ScoreScreen = ({route}) => {

  const yourResults = route.params.results.filter((e: gameResults) => e.isOpponent === false)[0];
  const opponentResults = route.params.results.filter((e: gameResults) => e.isOpponent === true)[0];
  const [yourPressedWord, setYourPressedWord] = useState<wordResults>();
  const [opponentPressedWord, setOpponentPressedWord] = useState<wordResults>();

  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Personale" 
        children={() => <TabScore 
          result={yourResults} 
          wordPressed={yourPressedWord}
          onPressWord={(e) => setYourPressedWord(e)}/>}
        />
      <Tab.Screen 
      name="Avversario" 
      children={() => <TabScore 
        result={opponentResults}
        wordPressed={opponentPressedWord}
        onPressWord={(e) => setOpponentPressedWord(e)} />} />
    </Tab.Navigator>
  )
}

const makeStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  wordContainer: {
    flex: 1,
  },
  boardContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  pointsContainer: {
    marginTop: 10,
  }
  
});

export default ScoreScreen;