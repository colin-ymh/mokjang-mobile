import {View, StyleSheet} from 'react-native';

import {GRAY} from '../../../constants/style/color';
import RequestVerify from '../../molecules/register-screen/request-verify';

const RegisterContainer = () => {
  return (
    <View style={styles.container}>
      <RequestVerify />
    </View>
  );
};

export default RegisterContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GRAY.SIDE_BAR,
    justifyContent: 'center',
    padding: 20,
  },
});
