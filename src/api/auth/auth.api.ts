import axios, {AxiosResponse} from 'axios';
import qs from 'query-string';

import {SERVER_URL, TEST_SERVER_URL} from '../../constants/url';
import authorizeAxios from '../authorize-axios';
import {OAUTH_PROVIDER} from '../../constants/common';

export enum IS_TEST {
  INTERNAL_TEST = 'internalTest',
  BETA_TEST = 'betaTest',
  PRODUCTION = 'production',
}

export enum AUTH {
  GOOGLE = 'google',
  NAVER = 'naver',
  KAKAO = 'kakao',
}

type getOAuthParams = {
  provider: AUTH;
};

type getTestAuthParams = {
  provider: OAUTH_PROVIDER;
  providerId: string;
};

type getVerificationRequestParams = {};

type getVerificationRequestBody = {
  name: string;
  mobilePhone: string;
  isTest: IS_TEST;
};

type getVerificationVerifyBody = {
  code: string;
};

type getSignInBody = {
  privacyPolicyAgreed: boolean;
};

export class AuthApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * OAuth 요청
   * @param {getOAuthParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getOAuth = (params: getOAuthParams) => {
    const {provider} = params;

    const url = `${this._url}/auth/login/${provider}`;

    try {
      return url;
      // return await axios.get(url.toString());
    } catch (serverError: any) {
      throw serverError;
      // if (serverError.response) {
      //   const { message, error, statusCode } = serverError.response.data;
      //   throw new CustomError(message, error, statusCode);
      // } else {
      //   throw new CustomError(
      //     '알 수 없는 에러가 발생했습니다',
      //     500,
      //     'Unknown Error'
      //   );
      // }
    }
  };

  /**
   * 로그인
   * @param {getTestAuthParams} params
   * @returns {Promise<AxiosResponse>}
   */
  public getMobileAuth = async (
    params: getTestAuthParams,
  ): Promise<AxiosResponse> => {
    const queryParams = qs.stringify({...params, loginOption: 'mobile'});
    const url = `${this._url}/auth/mobile-login?${queryParams}`;

    try {
      return await axios.post(url.toString(), params);
    } catch (serverError: any) {
      throw serverError;
      // if (serverError.response) {
      //   const { message, error, statusCode } = serverError.response.data;
      //   throw new CustomError(message, error, statusCode);
      // } else {
      //   throw new CustomError(
      //     '알 수 없는 에러가 발생했습니다',
      //     500,
      //     'Unknown Error'
      //   );
      // }
    }
  };

  /**
   * 인증번호 요청
   * @param {getVerificationRequestParams} params
   * @param {getVerificationRequestBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public getVerificationRequest = async (
    params: getVerificationRequestParams,
    body: getVerificationRequestBody,
  ): Promise<AxiosResponse> => {
    const url = new URL('/auth/verification/request', this._url);

    try {
      return await authorizeAxios.post(url.toString(), body);
    } catch (serverError: any) {
      throw serverError;
      // if (serverError.response) {
      //   const { message, error, statusCode } = serverError.response.data;
      //   throw new CustomError(message, error, statusCode);
      // } else {
      //   throw new CustomError(
      //     '알 수 없는 에러가 발생했습니다',
      //     500,
      //     'Unknown Error'
      //   );
      // }
    }
  };

  /**
   * 인증번호 확인
   * @param {getVerificationVerifyBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public getVerificationVerify = async (
    body: getVerificationVerifyBody,
  ): Promise<AxiosResponse> => {
    const url = new URL('/auth/verification/verify', this._url);

    try {
      return await authorizeAxios.post(url.toString(), body);
    } catch (serverError: any) {
      throw serverError;
      // if (serverError.response) {
      //   const { message, error, statusCode } = serverError.response.data;
      //   throw new CustomError(message, error, statusCode);
      // } else {
      //   throw new CustomError(
      //     '알 수 없는 에러가 발생했습니다',
      //     500,
      //     'Unknown Error'
      //   );
      // }
    }
  };

  /**
   * 로그인
   * @param {getSignInBody} body
   * @returns {Promise<AxiosResponse>}
   */
  public getSignIn = async (body: getSignInBody): Promise<AxiosResponse> => {
    const url = new URL('/auth/sign-in', this._url);

    try {
      return await authorizeAxios.post(url.toString(), body);
    } catch (serverError: any) {
      throw serverError;
      // if (serverError.response) {
      //   const { message, error, statusCode } = serverError.response.data;
      //   throw new CustomError(message, error, statusCode);
      // } else {
      //   throw new CustomError(
      //     '알 수 없는 에러가 발생했습니다',
      //     500,
      //     'Unknown Error'
      //   );
      // }
    }
  };

  /**
   * Access 토큰 재발급
   * @returns {Promise<AxiosResponse>}
   */
  public getRefreshToken = async (): Promise<AxiosResponse> => {
    const url = new URL('/auth/token/rotate', this._url);

    try {
      return await authorizeAxios.post(url.toString());
    } catch (serverError: any) {
      throw serverError;
      // if (serverError.response) {
      //   const { message, error, statusCode } = serverError.response.data;
      //   throw new CustomError(message, error, statusCode);
      // } else {
      //   throw new CustomError(
      //     '알 수 없는 에러가 발생했습니다',
      //     500,
      //     'Unknown Error'
      //   );
      // }
    }
  };

  /**
   * 유저 정보 가져오기
   * @returns {Promise<AxiosResponse>}
   */
  public getUser = async (): Promise<AxiosResponse> => {
    const url = new URL('/auth/user', this._url);

    try {
      return await authorizeAxios.get(url.toString());
    } catch (serverError: any) {
      throw serverError;
      // if (serverError.response) {
      //   const { message, error, statusCode } = serverError.response.data;
      //   throw new CustomError(message, error, statusCode);
      // } else {
      //   throw new CustomError(
      //     '알 수 없는 에러가 발생했습니다',
      //     500,
      //     'Unknown Error'
      //   );
      // }
    }
  };

  /**
   * Temporal Token 이 쿠키에 존재하는지 확인
   * @returns {Promise<AxiosResponse>}
   */
  public getIsTemporalToken = async (): Promise<AxiosResponse> => {
    const url = new URL('/auth/temporal-token', this._url);

    try {
      return await authorizeAxios.get(url.toString());
    } catch (serverError: any) {
      throw serverError;
      // if (serverError.response) {
      //   const { message, error, statusCode } = serverError.response.data;
      //   throw new CustomError(message, error, statusCode);
      // } else {
      //   throw new CustomError(
      //     '알 수 없는 에러가 발생했습니다',
      //     500,
      //     'Unknown Error'
      //   );
      // }
    }
  };

  /**
   * 로그아웃 (쿠키 만료)
   * @returns {Promise<AxiosResponse>}
   */
  public getLogOut = async (): Promise<AxiosResponse> => {
    const url = new URL('/auth/logout', this._url);

    try {
      // 반드시 withCredentials: true 옵션을 사용해야
      // 브라우저가 쿠키를 전송하고, 응답의 Set-Cookie도 적용해 쿠키가 만료됨
      return await authorizeAxios.post(
        url.toString(),
        {},
        {withCredentials: true},
      );
    } catch (serverError: any) {
      throw serverError;
    }
    //   if (serverError.response) {
    //     const {message, error, statusCode} = serverError.response.data;
    //     throw new CustomError(message, error, statusCode);
    //   } else {
    //     throw new CustomError(
    //       '알 수 없는 에러가 발생했습니다.',
    //       500,
    //       'Unknown Error',
    //     );
    //   }
    // }
  };
}
