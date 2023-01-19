import {Linking, Platform} from 'react-native';

const LinkingUtils = {openURL, sendEmail, callPhoneNumber, openAppStore};

async function openURL(url: string) {
  // check if we can use this link

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      throw new Error('Provided URL can not be handled');
    }
  } catch (e) {
    throw e;
  }

  return Linking.openURL(url);
}

async function sendEmail(to: string) {
  let url = `mailto:${to}`;
  return openURL(url);
}

async function callPhoneNumber(num: string) {
  let url = `tel:${num}`;
  return openURL(url);
}

async function openAppStore() {
  let url = '';
  if (Platform.OS === 'ios') {
    url = 'itms-apps://apps.apple.com/it/app/parole-incrociate/id6443878446';
  }
  if (Platform.OS === 'android') {
    url = 'market://details?id=com.paroleincrociate';
  }
  return openURL(url);
}

export default LinkingUtils;
