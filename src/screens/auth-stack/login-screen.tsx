import {View, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDispatch} from 'react-redux';

import {AUTH_STACK, AuthStackParams} from '../../constants/navigator/navigator';
import Login from '../../components/organisms/login-screen/login';
import Button from '../../components/atoms/common/button/button';
import {AuthApi} from '../../api/auth/auth.api';
import {UserApi} from '../../api/user/user.api';
import {setUser} from '../../redux/reducers/user-reducer';
import {IS_PRODUCTION} from '../../constants/env';
import {GRAY} from '../../constants/style/color';

type LoginScreenProps = NativeStackScreenProps<
  AuthStackParams,
  typeof AUTH_STACK.LOGIN.NAME
>;

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const dispatch = useDispatch();
  const authApi = new AuthApi(false);
  const userApi = new UserApi(false);

  // 개발용: OAuth 키 없이 백엔드 테스트 계정(테스트/1)으로 로그인해 화면 검증.
  const onTestLogin = async () => {
    try {
      await authApi.getTestAuth({provider: '테스트', providerId: '1'});
      const userResponse = await userApi.getUser();
      const me = userResponse.data?.data ?? userResponse.data;
      if (me) {
        dispatch(setUser(me));
        navigation.navigate(AUTH_STACK.MAIN_BOTTOM_TAB.NAME);
      }
    } catch (error) {
      console.error('테스트 로그인 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Login />
      {!IS_PRODUCTION && (
        <View style={styles.testBox}>
          <Button
            text={'🧪 테스트 로그인 (테스트/1)'}
            height={44}
            backgroundColor={GRAY.DARK}
            onPress={onTestLogin}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  testBox: {paddingHorizontal: 24, paddingBottom: 40},
});

export default LoginScreen;
