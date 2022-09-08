import React from 'react';
import {Text} from 'react-native';

const AppText = (props: any) => {
  // Put your default font styles here.
  let style = [{fontFamily: 'AirbnbCereal_W_Md'}];
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
