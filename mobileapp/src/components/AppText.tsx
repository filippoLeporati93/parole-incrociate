import React from 'react';
import {Text} from 'react-native';
import { useTheme } from 'react-native-paper';

const AppText = (props: any) => {
  // Put your default font styles here.
  const theme = useTheme();

  let style = [{color: theme.colors.text, fontFamily: 'AirbnbCereal_W_Md'}];
  if (props.style) {
    if (Array.isArray(props.style)) {
      style = style.concat(props.style);
    } else {
      if (props.style.fontWeight === 'bold') {
        style = [{fontFamily: 'AirbnbCereal_W_Bd'}];
        delete props.style.fontWeight;
      }
      style.push(props.style);
    }
  }

  return (
    <Text {...props} style={style}>
      {props.children}
    </Text>
  );
};

export default AppText;
