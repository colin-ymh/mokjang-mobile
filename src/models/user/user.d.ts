export type ChurchUser = {
  id: number;
  churchId: number;
  role?: string;
  church?: any;
  member?: any;
};

export type User = {
  id: number;
  mobilePhone: string;
  name: string;

  memberId?: number;
  member?: any;
  church?: any;

  // 백엔드 getUser 응답에 포함. churchId 조회에 사용.
  churchUser?: ChurchUser[];
};
