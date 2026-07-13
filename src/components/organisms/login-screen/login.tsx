import {useState} from 'react';
import {Linking} from 'react-native';
import {AUTH, AuthApi} from '../../../api/auth/auth.api';
import LoginView from './login.view';

const LoginScreen = () => {
  const authApi = new AuthApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);

  if (thrownError) {
    throw thrownError;
  }

  const onPressItem = async (provider?: AUTH) => {
    try {
      if (!provider) return;

      const oauthUrl = authApi.getOAuth({provider});

      // 👉 RN에서는 외부 브라우저 열기
      await Linking.openURL(oauthUrl);
    } catch (error) {
      setThrownError(error as Error);
    }
  };

  return <><LoginView onPressItem={onPressItem} /></>;
};

export default LoginScreen;
