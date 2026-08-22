import {AxiosResponse} from 'axios';

import authorizeAxios from '../authorize-axios';
import {CustomError} from '../error/error';
import {IS_PRODUCTION, SERVER_URL, TEST_SERVER_URL} from '../../constants/env';
import {CreateMemberBody} from '../../models/member/member';

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

export class MemberApi {
  private _url: string;

  constructor() {
    this._url = IS_PRODUCTION ? SERVER_URL : TEST_SERVER_URL;
  }

  /** 교인 목록 (v2, cursor 페이지네이션 + 검색) */
  public getMembers = async (params: {
    churchId: number;
    limit?: number;
    cursor?: string;
    search?: string;
  }): Promise<AxiosResponse> => {
    const {churchId, limit = 30, cursor, search} = params;
    const query = buildQuery({limit, cursor, search});
    const url = `${this._url}/churches/${churchId}/members/v2?${query}`;

    try {
      return await authorizeAxios.get(url);
    } catch (e) {
      return throwCustom(e);
    }
  };

  /** 교인 상세 */
  public getMember = async (params: {
    churchId: number;
    memberId: string;
  }): Promise<AxiosResponse> => {
    const {churchId, memberId} = params;
    const url = `${this._url}/churches/${churchId}/members/${memberId}`;
    try {
      return await authorizeAxios.get(url);
    } catch (e) {
      return throwCustom(e);
    }
  };

  /** 교인 생성 */
  public createMember = async (params: {
    churchId: number;
    body: CreateMemberBody;
  }): Promise<AxiosResponse> => {
    const {churchId, body} = params;
    const url = `${this._url}/churches/${churchId}/members`;
    try {
      return await authorizeAxios.post(url, body);
    } catch (e) {
      return throwCustom(e);
    }
  };

  /** 교인 수정 */
  public updateMember = async (params: {
    churchId: number;
    memberId: string;
    body: Partial<CreateMemberBody> & Record<string, unknown>;
  }): Promise<AxiosResponse> => {
    const {churchId, memberId, body} = params;
    const url = `${this._url}/churches/${churchId}/members/${memberId}`;
    try {
      return await authorizeAxios.patch(url, body);
    } catch (e) {
      return throwCustom(e);
    }
  };

  /** 교인 삭제 */
  public deleteMember = async (params: {
    churchId: number;
    memberId: string;
  }): Promise<AxiosResponse> => {
    const {churchId, memberId} = params;
    const url = `${this._url}/churches/${churchId}/members/${memberId}`;
    try {
      return await authorizeAxios.delete(url);
    } catch (e) {
      return throwCustom(e);
    }
  };
}
