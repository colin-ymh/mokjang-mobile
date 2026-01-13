import axios from 'axios';
import {TEST_SERVER_URL} from '../constants/url';
import CookieManager from '@react-native-cookies/cookies';

const authorizeAxios = axios.create({
  baseURL: TEST_SERVER_URL,
  withCredentials: true, // ✅ 쿠키 자동 포함
});

/**
 * ✅ 쿠키에 Access Token과 Refresh Token 저장
 */
export async function setAuthorizationToken({
  temporalToken,
  accessToken,
  refreshToken,
}: {
  temporalToken?: string;
  accessToken?: string;
  refreshToken?: string;
}) {
  try {
    // ✅ Access Token 저장
    if (accessToken) {
      await CookieManager.set(TEST_SERVER_URL, {
        name: 'MJAT',
        value: accessToken,
        path: '/',
        secure: false, // HTTPS 환경이면 true
        httpOnly: false, // 클라이언트에서 접근 가능
      });
    }

    // ✅ Refresh Token 저장
    if (refreshToken) {
      await CookieManager.set(TEST_SERVER_URL, {
        name: 'MJRT',
        value: refreshToken,
        path: '/',
        secure: false,
        httpOnly: true, // 보안 강화를 위해 true
      });
    }

    // ✅ Temporal Token 저장
    if (temporalToken) {
      await CookieManager.set(TEST_SERVER_URL, {
        name: 'MJTT',
        value: temporalToken,
        path: '/',
        secure: false,
        httpOnly: false, // 필요에 따라 true로 설정 가능
      });
    }

    // ✅ 쿠키 저장 후 확인
    const cookies = await CookieManager.get(TEST_SERVER_URL);
    console.log('✅ Stored Cookies:', cookies);
  } catch (error) {
    console.error('❌ Error storing token in cookies:', error);
  }
}

/**
 * ✅ Axios 요청 인터셉터: 쿠키 자동 포함
 */
authorizeAxios.interceptors.request.use(
  async config => {
    try {
      const cookies = await CookieManager.get(TEST_SERVER_URL);
      const accessToken = cookies.MJAT?.value;
      const temporalToken = cookies.MJTT?.value;

      if (accessToken && config.headers) {
        console.log('✅ Cookie-based Authentication:', accessToken);
      } else if (temporalToken && config.headers) {
        console.log('✅ Cookie-based Temporal Auth:', temporalToken);
      } else {
        console.log('❌ No Access Token found in cookies');
      }
    } catch (error) {
      console.error('❌ Error retrieving token from cookies:', error);
    }
    return config;
  },
  error => Promise.reject(error),
);

/**
 * ✅ Axios 응답 인터셉터: Access Token 만료 시 Refresh Token을 사용하여 재발급
 */
authorizeAxios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      try {
        // ✅ 저장된 쿠키 확인
        const cookies = await CookieManager.get(TEST_SERVER_URL);
        console.log('🔄 Refreshing Token, Stored Cookies:', cookies);

        const refreshToken = cookies.MJRT?.value; // Refresh Token 가져오기
        if (!refreshToken) {
          console.log('❌ No Refresh Token found, clearing all cookies.');
          await CookieManager.clearAll();
          return Promise.reject(error);
        }

        // ✅ Refresh Token을 이용해 새로운 Access Token 요청
        const refreshResponse = await axios.post(
          `${TEST_SERVER_URL}/auth/token/rotate`,
          {},
          {
            withCredentials: true, // ✅ 쿠키 전송 설정 추가
          },
        );

        console.log(refreshResponse);

        const newAccessToken = refreshResponse.data.accessToken;
        console.log('🔄 New Access Token received:', newAccessToken);

        // ✅ 새로운 Access Token 저장
        await setAuthorizationToken(newAccessToken);

        // ✅ 기존 요청을 새로운 토큰으로 다시 실행
        return authorizeAxios(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
        console.error('❌ Token Refresh Failed, logging out:', refreshError);
        await CookieManager.clearAll();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default authorizeAxios;
