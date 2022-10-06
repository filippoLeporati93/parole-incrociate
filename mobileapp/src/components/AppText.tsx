import React from 'react';
import {StyleSheet, Text} from 'react-native';
import { useTheme } from 'react-native-paper';


const AppText = (props : any) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  let textStyle: {}= styles.regular
  switch (props.textType) {
    case 'regular':
      textStyle = styles.regular
      break
    case 'bold':
      textStyle = styles.bold
      break
    case 'light':
      textStyle = styles.light
      break
    default:
      textStyle = styles.regular
      break
  }

  const passedStyles = Array.isArray(props.style) ? Object.assign({}, ...props.style) : props.style

  return (
    <Text {...props} style={[textStyle, passedStyles]}>
      {props.children}
    </Text>
  );
};

const makeStyles = (colors: any) => StyleSheet.create({
  regular: {
    color: colors.text,
    fontFamily: 'AirbnbCereal_W_Md'
  },
  bold: {
    color: colors.text,
    fontFamily: 'AirbnbCereal_W_Bd'
  },
  light: {
    color: colors.text,
    fontFamily: 'AirbnbCereal_W_Lt'
  }
})

export default AppText;
