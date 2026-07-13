import {View, StyleSheet} from 'react-native';

import {OAUTH_PROVIDER} from '../../../constants/common';
import Button from '../../../components/atoms/common/button/button';
import {BLACK} from '../../../constants/style/color';

type OauthListViewProps = {
  onPressOauth: (provider: OAUTH_PROVIDER) => void;
};

const OauthListView = ({onPressOauth}: OauthListViewProps) => {
  return (
    <View style={styles.container}>
      <Button
        text="구글 로그인"
        backgroundColor="#4285F4"
        onPress={() => onPressOauth(OAUTH_PROVIDER.GOOGLE)}
        height={40}
      />
      <Button
        text="카카오 로그인"
        backgroundColor="#FEE500"
        color={BLACK}
        onPress={() => onPressOauth(OAUTH_PROVIDER.KAKAO)}
        height={40}
      />
      <Button
        text="네이버 로그인"
        backgroundColor="#03C75A"
        onPress={() => onPressOauth(OAUTH_PROVIDER.NAVER)}
        height={40}
      />
    </View>
  );
};

export default OauthListView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 15, // RN 0.71+ / Fabric 환경에서 사용 가능
  },
});
