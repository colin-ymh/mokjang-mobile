// 모바일용 Worship/출석 타입 (웹 @mokjang/models worship의 필요 필드 subset).
// enum류는 백엔드 문자열 값을 그대로 받으므로 string으로 단순화한다.
import {Member} from '../member/member';

export type Worship = {
  id: string;
  title: string;
  description?: string;
  worshipDay: number; // 0(일)~6(토)
  repeatPeriod: number;
};

export type WorshipSession = {
  id: string;
  worshipId: string;
  title?: string; // 설교제목
  bibleTitle?: string; // 성경본문
  description?: string;
  sessionDate: string; // ISO date
  inCharge?: Member | null;
  inChargeId?: string;
};

export type WorshipEnrollmentSummary = {
  id: string;
  memberId: string;
  member: Member;
};

export type WorshipAttendance = {
  id: string;
  attendanceStatus: 'unknown' | 'present' | 'absent';
  note?: string;
  worshipEnrollment: WorshipEnrollmentSummary;
};

export type WorshipsResponse = {
  data: Worship[];
  page: number;
  take: number;
  totalCount?: number;
};

export type WorshipAttendancesResponse = {
  data: WorshipAttendance[];
  nextCursor?: string | null;
  hasMore?: boolean;
};
