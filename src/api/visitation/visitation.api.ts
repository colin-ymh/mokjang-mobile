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
    throw new CustomError(message, error, statusCode);
  }
  throw new CustomError('알 수 없는 에러가 발생했습니다', 500, 'Unknown Error');
};

export class VisitationApi {
  private _url: string;

  constructor() {
    this._url = IS_PRODUCTION ? SERVER_URL : TEST_SERVER_URL;
  }

  /** 심방 목록 (page/take 페이지네이션 + 제목/상태 필터) */
  public getVisitations = async (params: {
    churchId: number;
    page?: number;
    take?: number;
    title?: string;
    status?: string;
    orderDirection?: string;
  }): Promise<AxiosResponse> => {
    const {
      churchId,
      page = 1,
      take = 20,
      title,
      status,
      orderDirection = 'DESC',
    } = params;
    const query = buildQuery({page, take, title, status, orderDirection});
    const url = `${this._url}/churches/${churchId}/visitations?${query}`;

    try {
      return await authorizeAxios.get(url);
    } catch (e) {
      return throwCustom(e);
    }
  };

  /** 심방 상세 */
  public getVisitation = async (params: {
    churchId: number;
    visitationId: string;
  }): Promise<AxiosResponse> => {
    const {churchId, visitationId} = params;
    const url = `${this._url}/churches/${churchId}/visitations/${visitationId}`;
    try {
      return await authorizeAxios.get(url);
    } catch (e) {
      return throwCustom(e);
    }
  };
}
