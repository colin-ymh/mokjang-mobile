import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';

import Loading from '../../atoms/common/loading/loading';
import ToastPopup from '../../atoms/common/popup/toast-popup';
import {TOAST_DIRECTION} from '../../atoms/common/popup/toast-popup.view';
import {AuthApi, IS_TEST} from '../../../api/auth/auth.api';
import {UserApi} from '../../../api/user/user.api';
import {setAuthorizationToken} from '../../../api/authorize-axios';

import RequestVerifyView from './request-verify.view';
import {BLANK} from '../../../constants/common';
import {getFormattedMobilePhone, getFormattedName} from '../../../utils/format';
import {DESTRUCTIVE} from '../../../constants/style/color';
import {setUser} from '../../../redux/reducers/user-reducer';
import {RootState} from '../../../redux/store';
import {
  AUTH_STACK,
  AuthStackParams,
} from '../../../constants/navigator/navigator';

const RequestVerify = () => {
  const dispatch = useDispatch();
  const {provider, providerId} = useSelector((state: RootState) => state.auth);

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParams>>();

  const authApi = new AuthApi(false);
  const userApi = new UserApi(false);

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  const [isErrorShown, setIsErrorShown] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>(BLANK);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>(BLANK);
  const [mobilePhone, setMobilePhone] = useState<string>(BLANK);
  const [verifyNumber, setVerifyNumber] = useState<string>(BLANK);

  // 요청 여부
  const [isRequested, setIsRequested] = useState<boolean>(false);
  // 인증 여부
  const [isVerified, setIsVerified] = useState<boolean>(false);
  // 개인정보 동의 여부
  const [isConsent, setIsConsent] = useState<boolean>(false);
  // 인증 시간 타이머
  const [second, setSecond] = useState<number>(0);

  const onChangeName = (event: string): void => {
    setName(getFormattedName(event));
  };

  const onChangeMobilePhone = (event: string): void => {
    setMobilePhone(getFormattedMobilePhone(event));
  };

  const onChangeVerifyNumber = (event: string): void => {
    setVerifyNumber(event.slice(0, 6));
  };

  const onPressRequest = async () => {
    try {
      const response = await authApi.getVerificationRequest(
        {},
        {
          name,
          mobilePhone: mobilePhone.replace(/-/g, ''),
          isTest: IS_TEST.PRODUCTION,
        },
      );

      if (response.status === 201) {
        setSecond(1800);
        setIsRequested(true);
      }
    } catch (error: any) {
      setErrorText(error.response.data.message);
      setIsErrorShown(true);
    }
  };

  const onPressVerify = async () => {
    try {
      const response = await authApi.getVerificationVerify({
        code: verifyNumber,
      });
      if (response.data?.verified) {
        setIsVerified(true);
      }
    } catch (error: any) {
      setIsVerified(false);
      setIsErrorShown(true);
      setErrorText(error.response.data.message);
    }
  };

  const onChangeConsent = (value: boolean) => {
    setIsConsent(value);
  };

  // 회원 가입 완료 버튼 이벤트
  const onPressDone = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.getSignIn({
        privacyPolicyAgreed: isVerified,
      });

      if (response.status === 201 && provider) {
        // 로컬에 저장해둔 provider, providerId 재활용
        const serverResponse = await authApi.getMobileAuth({
          provider,
          providerId,
        });

        if (serverResponse.data.accessToken) {
          await setAuthorizationToken({
            accessToken: serverResponse.data.accessToken,
            refreshToken: serverResponse.data.refreshToken,
          });

          // 로컬에 사용자 정보 저장
          const userResponse = await userApi.getUser();
          if (userResponse.data) {
            dispatch(setUser(userResponse.data));
            navigation.navigate(AUTH_STACK.MAIN.NAME);
          }
        }
      }
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  };

  // 인증시간 타이머
  useEffect(() => {
    let timer: number | undefined;

    if (isRequested && second > 0) {
      timer = setInterval(() => {
        setSecond(prevSecond => prevSecond - 1);
      }, 1000) as unknown as number;
    }

    if (second === 0 && isRequested) {
      setIsRequested(false);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRequested, second]);

  const props = {
    name,
    mobilePhone,
    verifyNumber,
    second,
    isRequested,
    isVerified,
    isConsent,
    onChangeName,
    onChangeMobilePhone,
    onChangeVerifyNumber,
    onPressRequest,
    onPressVerify,
    onChangeConsent,
    onPressDone,
  };

  return (
    <>
      <RequestVerifyView {...props} />
      {isErrorShown && (
        <ToastPopup
          text={errorText}
          setIsShow={setIsErrorShown}
          backgroundColor={DESTRUCTIVE.DEFAULT}
          direction={TOAST_DIRECTION.BOTTOM}
        />
      )}
      <Loading isShow={isLoading} />
    </>
  );
};

export default RequestVerify;
