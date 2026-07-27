// 모바일용 Visitation 타입 (웹 @mokjang/models Visitation의 필요 필드 subset).
// enum류는 백엔드 문자열 값을 그대로 받으므로 string으로 단순화한다.
import {Member} from '../member/member';

export type VisitationDetail = {
  id?: string;
  visitationContent: string;
  visitationPray: string;
  member?: Member;
};

export type Visitation = {
  id: string;
  title: string;
  status: string; // 'reserve' | 'inProgress' | 'done' 등 백엔드 값
  visitationMethod: string; // 'inPerson' | 'remote'
  visitationType?: string; // 'single' | 'group'
  startDate: string;
  endDate: string;
  inCharge?: Member | null;
  members: Member[];
  visitationDetails: VisitationDetail[];

  createdAt?: string;
  updatedAt?: string;
};
