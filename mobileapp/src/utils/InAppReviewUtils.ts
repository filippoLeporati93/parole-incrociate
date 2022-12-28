import AsyncStorage from '@react-native-async-storage/async-storage';
import InAppReview from 'react-native-in-app-review';

const InAppReviewUtils = {
  getInAppReview,
  incrementAppOpening,
  setReviewFlowFinished,
  showReviewPane,
};

const IN_APP_REVIEW = '@in_app_review';

export interface IInAppReview {
  numAppOpening: number;
  lastAppOpeningDate: string;
  flowFinished: boolean;
  lastFlowReviewDate: string;
}

async function getInAppReview(): Promise<IInAppReview> {
  const preferencesJson = await AsyncStorage.getItem(IN_APP_REVIEW);
  if (preferencesJson != null) {
    return JSON.parse(preferencesJson);
  } else {
    return {
      numAppOpening: 0,
      lastAppOpeningDate: new Date('1900-01-01T00:00:00').toISOString(),
      flowFinished: false,
      lastFlowReviewDate: new Date('1900-01-01T00:00:00').toISOString(),
    };
  }
}

async function incrementAppOpening(): Promise<IInAppReview> {
  const preferencesJson = await AsyncStorage.getItem(IN_APP_REVIEW);
  if (preferencesJson != null) {
    let pref: IInAppReview = JSON.parse(preferencesJson);
    await AsyncStorage.setItem(
      IN_APP_REVIEW,
      JSON.stringify({
        ...pref,
        numAppOpening: pref.numAppOpening + 1,
        lastAppOpeningDate: new Date().toISOString(),
      })
    );
  } else {
    await AsyncStorage.setItem(
      IN_APP_REVIEW,
      JSON.stringify({
        numAppOpening: 1,
        lastAppOpeningDate: new Date().toISOString(),
        flowFinished: false,
        lastFlowReviewDate: new Date('1900-01-01T00:00:00').toISOString(),
      })
    );
  }
  return await getInAppReview();
}

async function setReviewFlowFinished(): Promise<IInAppReview> {
  const preferencesJson = await AsyncStorage.getItem(IN_APP_REVIEW);
  if (preferencesJson != null) {
    let pref: IInAppReview = JSON.parse(preferencesJson);
    await AsyncStorage.setItem(
      IN_APP_REVIEW,
      JSON.stringify({
        ...pref,
        flowFinished: true,
        lastFlowReviewDate: new Date().toISOString(),
      })
    );
  } else {
    await AsyncStorage.setItem(
      IN_APP_REVIEW,
      JSON.stringify({
        numAppOpening: 0,
        lastAppOpeningDate: new Date('1900-01-01T00:00:00').toISOString(),
        flowFinished: true,
        lastFlowReviewDate: new Date().toISOString(),
      })
    );
  }
  return await getInAppReview();
}

function showReviewPane(appreview: IInAppReview) {
  let deltaDate =
    new Date().getTime() - new Date(appreview.lastFlowReviewDate).getTime();
  // Show the review pane if delta is greater than 5 days and opened home at least log2 times
  if (
    !Number.isInteger(Math.log2(appreview.numAppOpening)) ||
    !(deltaDate / (1000 * 3600 * 24) >= 5)
  ) {
    return;
  }
  // This package is only available on android version >= 21 and iOS >= 10.3

  // Give you result if version of device supported to rate app or not!
  let isAvailable = InAppReview.isAvailable();

  // trigger UI InAppreview
  if (isAvailable) {
    InAppReview.RequestInAppReview()
      .then((hasFlowFinishedSuccessfully: boolean) => {
        if (hasFlowFinishedSuccessfully) {
          setReviewFlowFinished();
        }
      })
      .catch((error: any) => {
        //we continue our app flow.
        // we have some error could happen while lanuching InAppReview,
        // Check table for errors and code number that can return in catch.
        console.error(new Error(`[${error.code}] - ${error.message}`));
      });
  }
}

export default InAppReviewUtils;
