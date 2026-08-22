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

export class WorshipAttendancesApi {
  private _url: string;

  constructor() {
    this._url = IS_PRODUCTION ? SERVER_URL : TEST_SERVER_URL;
  }

  /** 세션 출석 목록 (cursor 페이지네이션) */
  public getWorshipAttendances = async (params: {
    churchId: number;
    worshipId: string;
    sessionId: string;
    limit?: number;
    cursor?: string;
  }): Promise<AxiosResponse> => {
    const {churchId, worshipId, sessionId, limit = 30, cursor} = params;
    const query = buildQuery({limit, cursor});
    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions/${sessionId}/attendances/v2?${query}`;
    try {
      return await authorizeAxios.get(url);
    } catch (e) {
      return throwCustom(e);
    }
  };

  /** 출석 상태/메모 수정 (토글마다 즉시 호출) */
  public editWorshipAttendance = async (params: {
    churchId: number;
    worshipId: string;
    sessionId: string;
    attendanceId: string;
    body: {
      attendanceStatus?: 'unknown' | 'present' | 'absent';
      note?: string;
    };
  }): Promise<AxiosResponse> => {
    const {churchId, worshipId, sessionId, attendanceId, body} = params;
    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions/${sessionId}/attendances/${attendanceId}`;
    try {
      return await authorizeAxios.patch(url, body);
    } catch (e) {
      return throwCustom(e);
    }
  };

  /** 세션 전원 출석 처리 */
  public patchAllAttended = async (params: {
    churchId: number;
    worshipId: string;
    sessionId: string;
  }): Promise<AxiosResponse> => {
    const {churchId, worshipId, sessionId} = params;
    const url = `${this._url}/churches/${churchId}/worships/${worshipId}/sessions/${sessionId}/attendances/all-attended`;
    try {
      return await authorizeAxios.patch(url);
    } catch (e) {
      return throwCustom(e);
    }
  };
}
