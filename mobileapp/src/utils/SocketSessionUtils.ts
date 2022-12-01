import AsyncStorage from '@react-native-async-storage/async-storage';
import {socketSession} from '../models/Types';

const SocketSessionUtils = {
  getSocketSession,
  setSocketSessionUserID,
  setSocketSessionID,
};

const SOCKET_SESSION_STORAGE_KEY = '@socket_session';

async function getSocketSession(): Promise<socketSession> {
  const uPref = await AsyncStorage.getItem(SOCKET_SESSION_STORAGE_KEY);
  let pref: socketSession = {
    sessionID: '',
    userID: '',
  };
  if (uPref != null) {
    pref = JSON.parse(uPref);
  }
  return pref;
}

async function setSocketSessionID(sessionID: string) {
  let uPref = await AsyncStorage.getItem(SOCKET_SESSION_STORAGE_KEY);
  let pref: socketSession = {
    sessionID: '',
    userID: '',
  };
  if (uPref != null) {
    pref = JSON.parse(uPref);
  }
  pref.sessionID = sessionID;
  await AsyncStorage.setItem(SOCKET_SESSION_STORAGE_KEY, JSON.stringify(pref));
}

async function setSocketSessionUserID(userID: string) {
  let uPref = await AsyncStorage.getItem(SOCKET_SESSION_STORAGE_KEY);
  let pref: socketSession = {
    sessionID: '',
    userID: '',
  };
  if (uPref != null) {
    pref = JSON.parse(uPref);
  }
  pref.userID = userID;
  await AsyncStorage.setItem(SOCKET_SESSION_STORAGE_KEY, JSON.stringify(pref));
}


export default SocketSessionUtils;
