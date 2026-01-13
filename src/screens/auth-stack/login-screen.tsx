import {NativeStackScreenProps} from '@react-navigation/native-stack';

import OauthList from '../../components/organisms/login-screen/oauth-list';
import {AUTH_STACK, AuthStackParams} from '../../constants/navigator/navigator';

type LoginScreenProps = NativeStackScreenProps<
  AuthStackParams,
  typeof AUTH_STACK.LOGIN.NAME
>;

const LoginScreen = ({navigation, route}: LoginScreenProps) => {
  return (
    <>
      <OauthList navigation={navigation} route={route} />
    </>
  );
};

export default LoginScreen;
