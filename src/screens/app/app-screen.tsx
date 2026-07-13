import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {AUTH_STACK, AuthStackParams} from '../../constants/navigator/navigator';
import {MainText} from '../../components/atoms/common/text/main-text';
import CustomWebview from '../../components/atoms/webview/custom-webview';
import {useRef} from 'react';


type AppScreenProps = NativeStackScreenProps<
  AuthStackParams,
  typeof AUTH_STACK.APP.NAME
>;

const AppScreen = ({navigation, route}: AppScreenProps) => {
  const webRef = useRef<null>(null);
  return (
    <>
      <CustomWebview webRef={webRef} uri={''} />
    </>
  );
};

export default AppScreen;
