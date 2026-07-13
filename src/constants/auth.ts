import {LOCALE} from './common';

export const KAKAO_BACKGROUND_COLOR = '#FEE500';
export const KAKAO_BORDER_COLOR = '#000000';
export const KAKAO_BORDER_OPACITY = 0.15;
export const KAKAO_BORDER_RADIUS = 12;

export const NAVER_BACKGROUND_COLOR = '#03C75A';

export const GOOGLE_BACKGROUND_COLOR = '#FFFFFF';
export const GOOGLE_BORDER_COLOR = '#000000';
export const GOOGLE_BORDER_OPACITY = 0.15;

export const getKakaoLoginText = (locale: LOCALE) => {
  if (locale === LOCALE.EN) {
    return 'Login with Kakao';
  } else {
    return '카카오 로그인';
  }
};

export const getNaverLoginText = (locale: LOCALE) => {
  if (locale === LOCALE.EN) {
    return 'Login with Naver';
  } else {
    return '네이버 로그인';
  }
};

export const getGoogleLoginText = (locale: LOCALE) => {
  if (locale === LOCALE.EN) {
    return 'Login with Google';
  } else {
    return 'Google로 로그인';
  }
};
