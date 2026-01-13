import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  getProfile,
  loginWithKakaoAccount,
} from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';

import {setAuthorizationToken} from '../../../api/authorize-axios';
import {setUser} from '../../../redux/reducers/user-reducer';

import {AuthApi} from '../../../api/auth/auth.api';
import {UserApi} from '../../../api/user/user.api';

import {
  AUTH_STACK,
  AuthStackParams,
} from '../../../constants/navigator/navigator';
import {OAUTH_PROVIDER} from '../../../constants/common';
import {setProvider, setProviderId} from '../../../redux/reducers/auth-reducer';
import OauthListView from './oauth-list.view';

type OauthListProps = NativeStackScreenProps<
  AuthStackParams,
  typeof AUTH_STACK.LOGIN.NAME
>;

const OauthList = ({navigation}: OauthListProps) => {
  const dispatch = useDispatch();
  const authApi = new AuthApi(false);
  const userApi = new UserApi(false);

  // 초기 설정
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId:
        '448611556147-30o1nrq5akocrtmbqriu2gcuvsjioo3v.apps.googleusercontent.com',
    });

    NaverLogin.initialize({
      appName: 'mokjang',
      consumerKey: 'fQHH1hsqVpucKd7R2CDS',
      consumerSecret: 'TvZmIAB0D6',
      serviceUrlSchemeIOS: 'mokjang',
      disableNaverAppAuthIOS: true,
    });
  }, []);

  const onPressOauth = async (provider: OAUTH_PROVIDER) => {
    try {
      let providerId: string | undefined;

      if (provider === OAUTH_PROVIDER.GOOGLE) {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        providerId = userInfo.data?.user.id;
      } else if (provider === OAUTH_PROVIDER.KAKAO) {
        await loginWithKakaoAccount();
        const profile = await getProfile();
        providerId = profile.id?.toString();
      } else if (provider === OAUTH_PROVIDER.NAVER) {
        const result = await NaverLogin.login();
        if (result.successResponse) {
          const naverProfile = await NaverLogin.getProfile(
            result.successResponse.accessToken,
          );
          providerId = naverProfile.response?.id?.toString();
        }
      }

      if (!providerId) return;

      const response = await authApi.getMobileAuth({provider, providerId});

      if (response.data.accessToken) {
        await setAuthorizationToken({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });

        const userResponse = await userApi.getUser();
        if (userResponse.data) {
          dispatch(setUser(userResponse.data));
          navigation.navigate(AUTH_STACK.MAIN.NAME);
        }
      } else if (response.data.temporal) {
        dispatch(setProvider(provider));
        dispatch(setProviderId(providerId));
        await setAuthorizationToken({temporalToken: response.data.temporal});
        navigation.navigate(AUTH_STACK.REGISTER.NAME);
      }
    } catch (error) {
      console.error('소셜 로그인 실패:', error);
    }
  };

  const props = {
    onPressOauth,
  };

  return (
    <>
      <OauthListView {...props} />
    </>
  );
};

export default OauthList;
