import {AxiosResponse} from 'axios';

import authorizeAxios from '../authorize-axios';
import {CustomError} from '../error/error';
import {IS_PRODUCTION, SERVER_URL, TEST_SERVER_URL} from '../../constants/env';
import {CreateVisitationBody} from '../../models/visitation/visitation';

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

  /** 심방 생성 */
  public createVisitation = async (params: {
    churchId: number;
    body: CreateVisitationBody;
  }): Promise<AxiosResponse> => {
    const {churchId, body} = params;
    const url = `${this._url}/churches/${churchId}/visitations`;
    try {
      return await authorizeAxios.post(url, body);
    } catch (e) {
      return throwCustom(e);
    }
  };

  /** 심방 수정 (메타필드만, visitationDetails 제외) */
  public editVisitation = async (params: {
    churchId: number;
    visitationId: string;
    body: {
      status?: string;
      visitationMethod?: string;
      title?: string;
      inChargeId?: string;
      startDate?: string;
      endDate?: string;
      memberIds?: string[];
    };
  }): Promise<AxiosResponse> => {
    const {churchId, visitationId, body} = params;
    const url = `${this._url}/churches/${churchId}/visitations/${visitationId}`;
    try {
      return await authorizeAxios.patch(url, body);
    } catch (e) {
      return throwCustom(e);
    }
  };

  /** 심방 내용/기도제목 수정 (별도 엔드포인트) */
  public editVisitationDetails = async (params: {
    churchId: number;
    visitationId: string;
    body: {
      visitationContent?: string;
      visitationPray?: string;
    };
  }): Promise<AxiosResponse> => {
    const {churchId, visitationId, body} = params;
    const url = `${this._url}/churches/${churchId}/visitations/${visitationId}/details`;
    try {
      return await authorizeAxios.patch(url, body);
    } catch (e) {
      return throwCustom(e);
    }
  };

  /** 심방 삭제 */
  public deleteVisitation = async (params: {
    churchId: number;
    visitationId: string;
  }): Promise<AxiosResponse> => {
    const {churchId, visitationId} = params;
    const url = `${this._url}/churches/${churchId}/visitations/${visitationId}`;
    try {
      return await authorizeAxios.delete(url);
    } catch (e) {
      return throwCustom(e);
    }
  };
}
