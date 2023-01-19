import AsyncStorage from '@react-native-async-storage/async-storage';
import {userPrefs} from '../models/Types';

const USER_PREF_STORAGE_KEY = '@user_prefs';
const defaultUserPref = {
  username: '',
  isFirstOpen: true,
  isAnalyticsEnabled: false,
  isNotificationEnabled: false,
};

const UserPreferencesUtils = {
  getUserPrefs,
  setUserPrefs,
  defaultUserPref,
};

async function getUserPrefs(): Promise<userPrefs> {
  const uPref = await AsyncStorage.getItem(USER_PREF_STORAGE_KEY);
  let pref: userPrefs = defaultUserPref;
  if (uPref !== null) {
    pref = JSON.parse(uPref);
  }
  return pref;
}

async function setUserPrefs(updatedPref: userPrefs) {
  let pref = await getUserPrefs();
  await AsyncStorage.setItem(
    USER_PREF_STORAGE_KEY,
    JSON.stringify({...pref, ...updatedPref})
  );
}

export default UserPreferencesUtils;
