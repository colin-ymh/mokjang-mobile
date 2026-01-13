import styled from 'styled-components/native';

import {OAUTH_PROVIDER} from '../../../constants/common';
import Button from '../../../components/atoms/common/button/button';
import {BLACK} from '../../../constants/style/color';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 20px;
`;

type OauthListViewProps = {
  onPressOauth: (provider: OAUTH_PROVIDER) => void;
};

const OauthListView = ({onPressOauth}: OauthListViewProps) => {
  return (
    <Container>
      <Button
        text={'구글 로그인'}
        backgroundColor={'#4285F4'}
        onPress={() => onPressOauth(OAUTH_PROVIDER.GOOGLE)}
        height={40}
      />
      <Button
        text={'카카오 로그인'}
        backgroundColor={'#FEE500'}
        color={BLACK}
        onPress={() => onPressOauth(OAUTH_PROVIDER.KAKAO)}
        height={40}
      />
      <Button
        text={'네이버 로그인'}
        backgroundColor={'#03C75A'}
        onPress={() => onPressOauth(OAUTH_PROVIDER.NAVER)}
        height={40}
      />
    </Container>
  );
};

export default OauthListView;
