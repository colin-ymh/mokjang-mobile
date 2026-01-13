import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AUTH_STACK, AuthStackParams} from '../constants/navigator/navigator';
import LoginScreen from '../screens/auth-stack/login-screen';
import RegisterScreen from '../screens/auth-stack/register-screen';
import MainBottomTab from './main-bottom-tab';

const Stack = createNativeStackNavigator<AuthStackParams>();

type AuthStackProps = {};

const AuthStack = ({}: AuthStackProps) => {
  return (
    <Stack.Navigator
      initialRouteName={AUTH_STACK.MAIN_BOTTOM_TAB.NAME}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={AUTH_STACK.LOGIN.NAME} component={LoginScreen} />
      <Stack.Screen
        name={AUTH_STACK.REGISTER.NAME}
        component={RegisterScreen}
      />
      <Stack.Screen
        name={AUTH_STACK.MAIN_BOTTOM_TAB.NAME}
        component={MainBottomTab}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
