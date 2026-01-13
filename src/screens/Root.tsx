import AuthStack from '../navigators/auth-stack';
import {NavigationContainer} from '@react-navigation/native';

import {Provider} from 'react-redux';
import Store from '../redux/store';

const Root = () => {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    </Provider>
  );
};

export default Root;
