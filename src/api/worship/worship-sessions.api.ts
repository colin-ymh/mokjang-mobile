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

export class WorshipSessionsApi {
  private _url: string;

  constructor() {
    this._url = IS_PRODUCTION ? SERVER_URL : TEST_SERVER_URL;
  }

  /** 날짜로 예배 세션 조회 (백엔드가 없으면 자동 생성) */
  public getWorshipSessionByDate = async (params: {
    churchId: number;
    worshipId: string;
    sessionDate: string; // YYYY-MM-DD
  }): Promise<AxiosResponse> => {
    const {churchId, worshipId, sessionDate} = params;
    const query = buildQuery({sessionDate});
    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions/by-date?${query}`;
    try {
      return await authorizeAxios.post(url);
    } catch (e) {
      return throwCustom(e);
    }
  };
}
