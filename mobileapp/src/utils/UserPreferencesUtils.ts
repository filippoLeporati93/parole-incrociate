import AsyncStorage from '@react-native-async-storage/async-storage';
import {userPrefs} from '../models/Types';

const UserPreferencesUtils = {
  getUsername,
  setUsername,
};

const USER_PREF_STORAGE_KEY = '@user_prefs';

async function getUsername(): Promise<string> {
  const uPref = await AsyncStorage.getItem(USER_PREF_STORAGE_KEY);
  let pref: userPrefs = {
    username: '',
  };
  if (uPref != null) {
    pref = JSON.parse(uPref);
  }
  return pref.username;
}

async function setUsername(username: string) {
  let uPref = await AsyncStorage.getItem(USER_PREF_STORAGE_KEY);
  let pref: userPrefs = {
    username: '',
  };
  if (uPref != null) {
    pref = JSON.parse(uPref);
  }
  pref.username = username;
  await AsyncStorage.setItem(USER_PREF_STORAGE_KEY, JSON.stringify(pref));
}

export default UserPreferencesUtils;
