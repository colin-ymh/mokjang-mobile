import {AxiosResponse} from 'axios';

import authorizeAxios from '../authorize-axios';
import {CustomError} from '../error/error';
import {IS_PRODUCTION, SERVER_URL, TEST_SERVER_URL} from '../../constants/env';

// 간단 쿼리스트링 빌더 (undefined/빈값 제외, 값 인코딩)
const buildQuery = (params: Record<string, string | number | undefined>) =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');

const throwCustom = (serverError: any): never => {
  if (serverError.response) {
    const {message, error, statusCode} = serverError.response.data;
    throw new CustomError(message, statusCode, error);
  }
  throw new CustomError('알 수 없는 에러가 발생했습니다', 500, 'Unknown Error');
};

// 예배 정의는 읽기전용 (생성/수정/삭제는 웹 관리자 전용).
export class WorshipApi {
  private _url: string;

  constructor() {
    this._url = IS_PRODUCTION ? SERVER_URL : TEST_SERVER_URL;
  }

  /** 예배 목록 (page/take 페이지네이션) */
  public getWorships = async (params: {
    churchId: number;
    page?: number;
    take?: number;
  }): Promise<AxiosResponse> => {
    const {churchId, page = 1, take = 20} = params;
    const query = buildQuery({page, take});
    const url = `${this._url}/churches/${churchId}/worships?${query}`;
    try {
      return await authorizeAxios.get(url);
    } catch (e) {
      return throwCustom(e);
    }
  };

  /** 예배 상세 */
  public getWorship = async (params: {
    churchId: number;
    worshipId: string;
  }): Promise<AxiosResponse> => {
    const {churchId, worshipId} = params;
    const url = `${this._url}/churches/${churchId}/worships/${worshipId}`;
    try {
      return await authorizeAxios.get(url);
    } catch (e) {
      return throwCustom(e);
    }
  };
}
