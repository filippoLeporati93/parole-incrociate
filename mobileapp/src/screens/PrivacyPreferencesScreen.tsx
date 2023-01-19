import React, {useCallback, useState} from 'react';
import {Pressable, SafeAreaView, StyleSheet} from 'react-native';
import Text from '../components/AppText';
import {ActivityIndicator, useTheme} from 'react-native-paper';
import analytics from '@react-native-firebase/analytics';
import perf from '@react-native-firebase/perf';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import {useUserPref} from '../hooks';

const PrivacyPreferencesScreen = ({navigation}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const [isLoading, setIsLoading] = useState(false);

  const [, , setUserPrefs] = useUserPref();

  const handlePermission = useCallback(() => {
    setIsLoading(true);
    const promisePermission: Promise<any>[] = [];
    promisePermission.push(perf().setPerformanceCollectionEnabled(true));
    promisePermission.push(crashlytics().setCrashlyticsCollectionEnabled(true));
    promisePermission.push(analytics().setAnalyticsCollectionEnabled(true));
    promisePermission.push(
      messaging()
        .setAutoInitEnabled(true)
        .then(() =>
          messaging().requestPermission({
            provisional: true,
          })
        )
    );
    Promise.all(promisePermission)
      .then(() => {
        setUserPrefs({
          isFirstOpen: false,
          isAnalyticsEnabled: true,
          isNotificationEnabled: true,
        });
        navigation.replace('HomeScreen');
      })
      .finally(() => setIsLoading(false));
  }, [navigation, setUserPrefs]);

  return (
    <SafeAreaView style={styles.container}>
      <Text
        textType="bold"
        style={{
          fontSize: 33,
          textAlign: 'center',
          color: theme.colors.primaryDark,
        }}
      >
        Parole Incrociate
      </Text>
      <Text
        textType="bold"
        style={{
          fontSize: 24,
          textAlign: 'center',
          lineHeight: 30,
          marginTop: 15,
        }}
      >
        Vogliamo dare l'esperienza migliore ai nostri clienti
      </Text>
      <Text
        textType="light"
        style={{fontSize: 15, textAlign: 'center', marginTop: 10}}
      >
        Parole Incrociate utilizza le ultime tecnologie per offrire
        un'esperienza immersiva e piacevole.{'\n\n'}
        Utilizziamo tecnologie analitiche che ci forniscono informazioni anonime
        sull'utulizzo dell'applicazione al fine di migliorare i nostri servizi,
        mentre tecnologie di marketing ci aiutano a pubblicizzare i nostri
        servizi in modo pertinente. Toccando "Autorizza", ci permetti di
        attivare queste tecnologie. Se scegli di non attivarle, la funzionalità
        di base potrebbe compromettere la qualità della tue esperienza.{'\n\n'}
        Le preferenze possono essere modificate in qualsiasi momento. Per
        ulteriori informazioni, consulta la nostra informativa sulla privacy.
      </Text>
      <Pressable
        style={styles.commandButton}
        onPress={() => handlePermission()}
      >
        {isLoading ? (
          <ActivityIndicator color={'white'} size={'small'} />
        ) : (
          <Text textType="bold" style={styles.commandButtonTitle}>
            Procedi
          </Text>
        )}
      </Pressable>

      <Pressable
        style={[styles.commandButtonClear]}
        onPress={() => {
          navigation.replace('HomeScreen');
        }}
      >
        <Text textType="bold" style={styles.commandButtonTitleClear}>
          Non autorizzare
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const makeStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: 15,
      alignItems: 'center',
    },
    title: {
      textAlign: 'center',
      fontSize: 30,
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 20,
      paddingStart: 20,
      color: 'white',
    },
    commandButton: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderRadius: 30,
      backgroundColor: colors.primaryDark,
      alignItems: 'center',
      marginTop: 30,
      width: '70%',
    },
    commandButtonTitle: {
      fontSize: 14,
      color: 'white',
    },
    commandButtonClear: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: colors.primaryDark,
      alignItems: 'center',
      marginVertical: 10,
      width: '70%',
    },
    commandButtonTitleClear: {
      fontSize: 14,
      color: colors.primaryDark,
    },
  });

export default PrivacyPreferencesScreen;
