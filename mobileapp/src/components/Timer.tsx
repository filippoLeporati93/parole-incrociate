import React, { useEffect, useImperativeHandle, useState } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';
import Text from './AppText';

export const formatTime = (elapsed: number) => {
  const hour = Math.floor(elapsed / 60 / 60);
  const minute = Math.floor(elapsed / 60 - hour * 60);
  const second = elapsed % 60;
  return [minute, second].map(x => x < 10 ? '0' + x : x).join(':');
}

type TimerProps = {
  onStop: (_seconds: number) => void
}

const Timer = React.forwardRef<any, TimerProps>((props, ref) => {

  const [elapsed, setElapsed] = useState<number>(0);

  useImperativeHandle(ref, () => {
    return { stop };
  });

  useEffect(() => {
    let startTime = new Date().getTime();
    let interval = setInterval(() => {
      const elapsed = Math.round((new Date().getTime() - startTime) / 1000)
      setElapsed(elapsed)
    }, 500)

    return () => {
      interval
    }
  }, [])

  const stop = () => {
    if(props.onStop)
      props.onStop(elapsed);
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <Text textType='light' style={styles.text}>Tempo</Text>
      <Text textType='bold' style={styles.text}>{formatTime(elapsed)}</Text>
    </View>
  );

});

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: 'gray'
  },
});


export default Timer;