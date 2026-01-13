import {AxiosResponse} from 'axios';

import {SERVER_URL, TEST_SERVER_URL} from '../../constants/url';
import authorizeAxios from '../authorize-axios';

export class UserApi {
  private _url: string;

  constructor(useBaseURL: boolean) {
    this._url = useBaseURL
      ? SERVER_URL // 실제 사용할 url
      : TEST_SERVER_URL; // 개발용 url
  }

  /**
   * 유저 정보 가져오기
   * @returns {Promise<AxiosResponse>}
   */
  public getUser = async (): Promise<AxiosResponse> => {
    const url = new URL('/users', this._url);

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
}
