import React, { useState } from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScrollView } from 'react-native-gesture-handler';
import Grid from '../components/Grid';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../components/AppText';
import { gameResults, wordResults } from '../models/Types';
import { useTheme } from 'react-native-paper';

const Tab = createMaterialTopTabNavigator();

type TabScoreProps = {
  result: gameResults,  
  wordPressed?: wordResults,
  onPressWord: (wordPressed: wordResults) => void,
}

const TabScore: React.FC<TabScoreProps> = props => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        <Grid 
        matrix={props.result.matrix} 
        wordPressed={props.wordPressed}
        />
      </View>
    <View style={styles.pointsContainer}>
      <Text style={{fontSize: 14, textAlign:'center', color:'gray'}}>Punteggio</Text>
      <Text style={{fontSize: 35, textAlign:'center'}}>{props.result.points}</Text>
    </View>
    <View style={styles.wordContainer}>
    <ScrollView>
      {
        props.result.words
        .sort((a,b) => b.word.length-a.word.length || a.word.localeCompare(b.word, 'it', { sensitivity: 'base' }))
        .map((e,idx) => 
          <View key={idx} style={{marginHorizontal: 30,}}>
          <Pressable
            onPress={() => props.onPressWord(e)}
            style={{flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 8,
              }}>
            <View style={{flex: 1,}}>
            <Text style={{fontSize: 23}}>
              {e.word}
            </Text>
            </View>
            <View style={{flex: 1,}}>
              <Text style={{color: 'gray', textAlign: 'right'}}>{e.word.length} punti</Text>
            </View>
            
            
          </Pressable>
          <View style={{borderWidth: StyleSheet.hairlineWidth, borderColor: 'gray'}}/>
          </View>
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