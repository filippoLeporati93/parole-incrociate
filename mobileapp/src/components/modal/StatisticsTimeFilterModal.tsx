import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Modal from "react-native-modal";
import { useTheme } from 'react-native-paper';
import Text from '../AppText';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  isVisible: boolean;
  timeFilterCodeSelected: string;
  onTimePress: (timeFilterCode: string) => any;
  onBackPress: () => any;
};

const StatisticsTimeFilterModal: React.FC<Props> = props => {
  const theme = useTheme();

  return (
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={props.onBackPress}
      onSwipeComplete={props.onBackPress}
      swipeDirection={['down']}
      useNativeDriverForBackdrop
      style={styles.view}>
      <View style={styles.content}>
        <Pressable style={styles.pressable} onPress={() => props.onTimePress('DAY')}>
          {props.timeFilterCodeSelected === 'DAY' ? <Icon name='check' color={theme.colors.text} size={20} /> : null}
          <Text style={[styles.contentTitle, props.timeFilterCodeSelected !== 'DAY' && styles.contentTitleNotSelected]}>Oggi</Text>
        </Pressable>
        <View style={styles.line} />
        <Pressable style={styles.pressable} onPress={() => props.onTimePress('WEEK')}>
          {props.timeFilterCodeSelected === 'WEEK' ? <Icon name='check' color={theme.colors.text} size={20} /> : null}
          <Text style={[styles.contentTitle, props.timeFilterCodeSelected !== 'WEEK' && styles.contentTitleNotSelected]}>Questa settimana</Text>
        </Pressable>
        <View style={styles.line} />
        <Pressable style={styles.pressable} onPress={() => props.onTimePress('MONTH')}>
          {props.timeFilterCodeSelected === 'MONTH' ? <Icon name='check' color={theme.colors.text} size={20} /> : null}
          <Text style={[styles.contentTitle, props.timeFilterCodeSelected !== 'MONTH' && styles.contentTitleNotSelected]}>Questo mese</Text>
        </Pressable>
        <View style={styles.line} />
        <Pressable style={styles.pressable} onPress={() => props.onTimePress('YEAR')}>
          {props.timeFilterCodeSelected === 'YEAR' ? <Icon name='check' color={theme.colors.text} size={20} /> : null}
          <Text style={[styles.contentTitle, props.timeFilterCodeSelected !== 'YEAR' && styles.contentTitleNotSelected]}>Quest'anno</Text>
        </Pressable>
        <View style={styles.line} />
        <Pressable style={styles.pressable} onPress={() => props.onTimePress('ALL')}>
          {props.timeFilterCodeSelected === 'ALL' ? <Icon name='check' color={theme.colors.text} size={20} /> : null}
          <Text style={[styles.contentTitle, props.timeFilterCodeSelected !== 'ALL' && styles.contentTitleNotSelected]}>Sempre</Text>
        </Pressable>
        <View style={styles.line} />
        <Pressable style={styles.pressable} onPress={() => props.onBackPress()}>
          <Text style={[styles.contentTitle,styles.contentTitleNotSelected]}>Annulla</Text>
        </Pressable>
        <View style={styles.line} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 20,
    marginBottom: 30,
  },
  content: {
    backgroundColor: 'white',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    width: '100%',
    textAlign: 'left',
    fontSize: 18,
    paddingStart: 15,
  },
  contentTitleNotSelected: {
    paddingStart: 25,
  },
  pressable:
    { alignItems: 'center', flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 10 }
  ,
  line: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    marginStart: 5,
    marginEnd: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'gray',
  },
});

export default StatisticsTimeFilterModal;