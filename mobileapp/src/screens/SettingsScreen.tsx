import React, {useCallback} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import Text from '../components/AppText';
import {List, Switch, useTheme} from 'react-native-paper';
import {useUserPref} from '../hooks';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinkingUtils from '../utils/LinkingUtils';
import analytics from '@react-native-firebase/analytics';
import perf from '@react-native-firebase/perf';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';

const SettingsScreen = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [, userPref, setUserPrefs] = useUserPref();

  const handlePermission = useCallback(
    (isAnalyticsEnabled: boolean) => {
      const promisePermission: Promise<any>[] = [];
      promisePermission.push(
        perf().setPerformanceCollectionEnabled(isAnalyticsEnabled)
      );
      promisePermission.push(
        crashlytics().setCrashlyticsCollectionEnabled(isAnalyticsEnabled)
      );
      promisePermission.push(
        analytics().setAnalyticsCollectionEnabled(isAnalyticsEnabled)
      );
      Promise.all(promisePermission).then(() => {
        setUserPrefs({isAnalyticsEnabled});
      });
    },
    [setUserPrefs]
  );

  const handleNotification = useCallback(
    (isNotificationEnabled: boolean) => {
      const promisePermission: Promise<any>[] = [];
      if (isNotificationEnabled) {
        promisePermission.push(messaging().setAutoInitEnabled(true));
      } else {
        promisePermission.push(messaging().setAutoInitEnabled(false));
        promisePermission.push(messaging().deleteToken());
      }
      Promise.all(promisePermission).then(() =>
        setUserPrefs({isNotificationEnabled})
      );
    },
    [setUserPrefs]
  );

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader style={styles.sectionContainer}>
          <Text style={styles.textSection}>Impostazioni</Text>
        </List.Subheader>
        <List.Item
          title={() => <Text style={styles.textItem}>Abilita notifiche</Text>}
          right={() => (
            <Switch
              color={theme.colors.primaryDark}
              value={userPref.isNotificationEnabled}
              onValueChange={value => handleNotification(value)}
            />
          )}
        />

        <List.Subheader style={styles.sectionContainer}>
          <Text style={styles.textSection}>Supporto</Text>
        </List.Subheader>
        <List.Item
          onPress={() => LinkingUtils.sendEmail('paroleincrociate@outlook.com')}
          title={() => <Text style={styles.textItem}>Chiedi supporto</Text>}
          right={() => (
            <Icon
              color={theme.colors.primaryDark}
              name={'chevron-right'}
              size={25}
            />
          )}
        />

        <List.Subheader style={styles.sectionContainer}>
          <Text style={styles.textSection}>Feedback</Text>
        </List.Subheader>
        <List.Item
          onPress={() => LinkingUtils.openAppStore()}
          title={() => <Text style={styles.textItem}>Condividi feedback</Text>}
          right={() => (
            <Icon
              color={theme.colors.primaryDark}
              name={'chevron-right'}
              size={25}
            />
          )}
        />
        <List.Item
          onPress={() => LinkingUtils.openAppStore()}
          title={() => <Text style={styles.textItem}>Dai un voto all'app</Text>}
          right={() => (
            <Icon
              color={theme.colors.primaryDark}
              name={'chevron-right'}
              size={25}
            />
          )}
        />

        <List.Subheader style={styles.sectionContainer}>
          <Text style={styles.textSection}>Legal</Text>
        </List.Subheader>
        <List.Item
          onPress={() =>
            LinkingUtils.openURL(
              'https://www.termsfeed.com/live/f8cdba3f-8133-4bd5-bdc0-2c2a97f2bcc2'
            )
          }
          title={() => (
            <Text style={styles.textItem}>Termini e condizioni generali</Text>
          )}
          right={() => (
            <Icon
              color={theme.colors.primaryDark}
              name={'chevron-right'}
              size={25}
            />
          )}
        />
        <List.Item
          onPress={() =>
            LinkingUtils.openURL(
              'https://www.freeprivacypolicy.com/live/d5626e46-b083-46a0-88dc-8319baa78126'
            )
          }
          title={() => (
            <Text style={styles.textItem}>Informativa sulla privacy</Text>
          )}
          right={() => (
            <Icon
              color={theme.colors.primaryDark}
              name={'chevron-right'}
              size={25}
            />
          )}
        />
        <List.Item
          title={() => (
            <Text style={styles.textItem}>
              Fornisci analisi di utilizzo dell'app
            </Text>
          )}
          right={() => (
            <Switch
              color={theme.colors.primaryDark}
              value={userPref.isAnalyticsEnabled}
              onValueChange={value => handlePermission(value)}
            />
          )}
        />
      </List.Section>
    </ScrollView>
  );
};

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    textItem: {
      fontSize: 15,
    },
    textSection: {
      color: 'gray',
      fontSize: 15,
    },
    sectionContainer: {
      backgroundColor: colors.backgroundGray,
    },
  });

export default SettingsScreen;
