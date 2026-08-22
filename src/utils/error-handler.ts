import {Alert} from 'react-native';

import {CustomError} from '../api/error/error';

export const showErrorAlert = (error: unknown, title: string = '오류') => {
  let message = '알 수 없는 오류가 발생했습니다.';

  if (error instanceof CustomError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  Alert.alert(title, message);
};
