import {View, Text, StyleSheet, Pressable, Image} from 'react-native';


import {
  getGoogleLoginText,
  getKakaoLoginText,
  getNaverLoginText,
  GOOGLE_BACKGROUND_COLOR,
  GOOGLE_BORDER_COLOR,
  GOOGLE_BORDER_OPACITY,
  KAKAO_BACKGROUND_COLOR,
  KAKAO_BORDER_COLOR,
  KAKAO_BORDER_OPACITY,
  KAKAO_BORDER_RADIUS,
  NAVER_BACKGROUND_COLOR,
} from '../../../constants/auth';

import {MainText} from '../../atoms/common/text/main-text';
import {AUTH} from '../../../api/auth/auth.api';
import {BLACK, GRAY, WHITE} from '../../../constants/style/color';

import Kakao from '../../../../public/png/kakao-logo.png';
import Naver from '../../../../public/png/naver-logo.png';
import Google from '../../../../public/png/google-logo.png';
import {LOCALE} from '../../../constants/common';

type LoginViewProps = {
  onPressItem: (provider: AUTH) => void;
};
type OAuthButtonProps = {
  icon: any;
  text: string;
  onPress: () => void;
  backgroundColor: string;
  borderColor?: string;
  borderOpacity?: number;
  borderRadius?: number;
  textColor?: string;
};

const OAuthButton = ({
                       icon,
                       text,
                       onPress,
                       backgroundColor,
                       borderColor,
                       borderOpacity = 1,
                       borderRadius = 12,
                       textColor = BLACK,
                     }: OAuthButtonProps) => {

  const hexToRgba = (hex: string, opacity = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.oauthItem,
        {
          backgroundColor,
          borderRadius,
          borderColor: borderColor
            ? hexToRgba(borderColor, borderOpacity)
            : 'transparent',
          borderWidth: borderColor ? 1 : 0,
        },
      ]}>
      <Image source={icon} style={styles.icon} />
      <Text style={[styles.oauthText, {color: textColor}]}>{text}</Text>
    </Pressable>
  );
};


const LoginView = ({onPressItem}: LoginViewProps) => {
  const locale = LOCALE.KO

  return (
    <View style={styles.container}>
      <MainText fontSize={24} fontWeight={700}>
        로그인
      </MainText>

      <View style={styles.list}>
        {/* 카카오 */}
        <OAuthButton
          backgroundColor={KAKAO_BACKGROUND_COLOR}
          borderColor={KAKAO_BORDER_COLOR}
          borderOpacity={KAKAO_BORDER_OPACITY}
          borderRadius={KAKAO_BORDER_RADIUS}
          onPress={() => onPressItem(AUTH.KAKAO)}
          icon={Kakao}
          text={getKakaoLoginText(locale)}
        />

        {/* 네이버 */}
        <OAuthButton
          backgroundColor={NAVER_BACKGROUND_COLOR}
          onPress={() => onPressItem(AUTH.NAVER)}
          icon={Naver}
          text={getNaverLoginText(locale)}
          textColor={WHITE}
        />

        {/* 구글 */}
        <OAuthButton
          backgroundColor={GOOGLE_BACKGROUND_COLOR}
          borderColor={GOOGLE_BORDER_COLOR}
          borderOpacity={GOOGLE_BORDER_OPACITY}
          onPress={() => onPressItem(AUTH.GOOGLE)}
          icon={Google}
          text={getGoogleLoginText(locale)}
          textColor={BLACK}
        />
      </View>

      <MainText fontSize={16} color={GRAY.DARK}>
        소셜 계정으로 간편하게 로그인하세요
      </MainText>
    </View>
  );
};

export default LoginView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE,
    gap: 30,
  },
  list: {
    width: '100%',
    gap: 16,
  },
  oauthItem: {
    height: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oauthText: {
    fontSize: 18,
    marginLeft: 12,
    fontWeight: '500',
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});
