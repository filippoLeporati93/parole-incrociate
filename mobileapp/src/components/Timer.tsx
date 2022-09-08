import React, { useEffect, useState } from 'react';

import {
  StyleSheet,
} from 'react-native';
import Text from './AppText';

const formatTime = (elapsed: number) => {
  const hour = Math.floor(elapsed / 60 / 60);
  const minute = Math.floor(elapsed / 60 - hour * 60);
  const second = elapsed % 60;
  return [hour, minute, second].map(x => x < 10 ? '0' + x : x).join(':');
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
    <Text style={styles.text}>{formatTime(elapsed)}</Text>
);
  
}

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '100',
  },
});


export default Timer;