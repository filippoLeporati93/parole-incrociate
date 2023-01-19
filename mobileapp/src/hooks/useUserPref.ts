import {useCallback, useEffect, useState} from 'react';
import {userPrefs} from '../models/Types';
import UserPreferencesUtils from '../utils/UserPreferencesUtils';

export const useUserPref = (): [
  boolean,
  userPrefs,
  (pref: userPrefs) => void
] => {
  const [userPref, setUserPref] = useState<userPrefs>(
    UserPreferencesUtils.defaultUserPref
  );

  const [retrivedFromStorage, setRetrievedFromStorage] = useState(false);

  useEffect(() => {
    (async () => {
      const d = await UserPreferencesUtils.getUserPrefs();
      setUserPref(d);
      setRetrievedFromStorage(true);
    })();
  }, []);

  const setUserPrefs = useCallback(
    (p: userPrefs) => {
      UserPreferencesUtils.setUserPrefs(p).then(() =>
        setUserPref({...userPref, ...p})
      );
    },
    [userPref]
  );

  return [retrivedFromStorage, userPref, setUserPrefs];
};
