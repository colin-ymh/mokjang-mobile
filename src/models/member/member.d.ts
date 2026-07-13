// 모바일 v1용 Member 타입 (웹 @mokjang/models Member의 필요 필드 subset).
// enum류는 백엔드 문자열 값을 그대로 받으므로 string으로 단순화한다.

export type MemberGroup = {
  id: string;
  name: string;
};

export type MemberOfficer = {
  id: number;
  name: string; // 직분명 (예: 장로, 집사)
};

export type Member = {
  id: string;
  name: string;
  mobilePhone: string;
  profileImageUrl?: string;

  gender?: string; // 'male' | 'female' 등 백엔드 값
  birth?: string;
  isLunar?: boolean;

  groupId?: string;
  group?: MemberGroup | null;
  groupRole?: string; // 'leader' 등

  officerId?: number;
  officer?: MemberOfficer | null;

  // 상세/등록 추가 정보
  address?: string;
  detailAddress?: string;
  occupation?: string;
  school?: string;

  createdAt?: string;
  updatedAt?: string;
};

// 교인 목록(v2) 응답
export type MembersV2Response = {
  data: Member[];
  nextCursor?: string | null;
  hasMore?: boolean;
};

// 교인 생성 요청 바디 (필수: name, mobilePhone)
export type CreateMemberBody = {
  name: string;
  mobilePhone: string;
  gender?: string;
  birth?: string;
  isLunar?: boolean;
};
