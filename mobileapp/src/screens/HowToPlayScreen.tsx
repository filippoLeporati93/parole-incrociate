import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
} from 'react-native';
import Text from '../components/AppText';
import {useTheme} from '@react-navigation/native';
import {wordResults, gameResults} from '../models/Types';
import { TabScore } from './ScoreScreen';

const matrix = [
  ["M", "S", "O", "C", "I"],
  ["B", "A", "R", "O", "V"],
  ["A", "S", "O", "L", "E"],
  ["R", "S", "A", "P", "L"],
  ["R", "I", "T", "I", "O"],
];

const words: wordResults[] = [
  {word: "SOCI", direction: "dx", location: [0,1]},
  {word: "BARO", direction: "dx", location: [1,0]},
  {word: "ASOLE", direction: "dx", location: [2,0]},
  {word: "SA", direction: "dx", location: [3,1]},
  {word: "RITI", direction: "dx", location: [4,0]},
  {word: "BAR", direction: "dy", location: [1,0]},
  {word: "SASSI", direction: "dy", location: [0,1]},
  {word: "ORO", direction: "dy", location: [0,2]},
  {word: "COLPI", direction: "dy", location: [0,3]},
  {word: "VELO", direction: "dy", location: [1,4]},
]

const results: gameResults = {
  points: 39,
  isOpponent: false,
  matrix: matrix,
  words: words
}

const HowToPlayScreen = ({navigation}: any) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const [wordPressed, setWordPressed] = useState<wordResults>();


  return (
    <ScrollView style={styles.container}
    contentContainerStyle={{ marginHorizontal: 10, }}>
      <Text style={{fontSize: 32}}>
      Come si gioca
      </Text>

      <Text style={{fontSize: 16, marginTop: 10, textAlign: 'justify'}}>
Ognuno dei due giocatori ha una griglia con cinque file di cinque caselle, che tiene nascosta dalla vista degli altri.
{"\n\n"}A turno i giocatori dicono una lettere che tutti devono mettere in una casella della griglia a loro scelta.
{"\n\n"}Quando sono state dette 25 lettere e la griglia è piena. Ciascun giocatore mostra la griglia e si contano i punti.
</Text>
  <Text style={{fontSize: 32, marginTop: 30}}>
      Come si contano i punti
      </Text>
      <Text style={{fontSize: 16, marginVertical: 10, textAlign: 'justify'}}>
Su ogni riga si vede qual è la parola più lunga che si legge da sinistra a destra. Essa vale tanti punti quante sono le lettere che la formano, come nell'esempio in figura: sulla prima riga SOCI vale 4 punti, BARO vale 4, ASOLE vale 5... Lo stesso si fa su ogni colonna, leggendo dall'alto in basso. 
{"\n\n"}Valgono i verbi coniugati, ma non i nomi propri e solo parole italiane. Chi fa più punti ha vinto!
      </Text>

      <TabScore 
      result={results} 
      wordPressed={wordPressed}
      onPressWord={(w) => setWordPressed(w)} />
    </ScrollView>
  );
};

export default HowToPlayScreen;

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 10,
    },    
  });
