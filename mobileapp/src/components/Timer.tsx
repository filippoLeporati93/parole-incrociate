import React, { useEffect, useState } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';
import Text from './AppText';

const formatTime = (elapsed: number) => {
  const hour = Math.floor(elapsed / 60 / 60);
  const minute = Math.floor(elapsed / 60 - hour * 60);
  const second = elapsed % 60;
  return [minute, second].map(x => x < 10 ? '0' + x : x).join(':');
}

const Timer = () =>  {
  
const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
      let startTime = new Date().getTime();
      let interval = setInterval(() => {
        const elapsed = Math.round((new Date().getTime() - startTime) / 1000)
        setElapsed(elapsed)
      }, 100)

      return () => {
          interval
      }
  },[])

return (
  <View style={{alignItems: 'center'}}>
    <Text style={styles.text}>Tempo</Text>
    <Text style={styles.text}>{formatTime(elapsed)}</Text>
  </View>
);
  
}

const styles = StyleSheet.create({
  text: {
    fontSize: 11,
    color: 'gray'
  },
});


export default Timer;