export const AUTH_STACK = {
  LOGIN: {NAME: 'LoginScreen', TITLE: '로그인 화면'},
  TEST_LOGIN: {NAME: 'TestLoginScreen', TITLE: '소셜로그인 화면'},
  MAIN_BOTTOM_TAB: {NAME: 'MainBottomTabNav', TITLE: '메인 스택'},
  REGISTER: {NAME: 'RegisterScreen', TITLE: '회원등록 화면'},
} as const;

export type AuthStackParams = {
  [KEY in keyof typeof AUTH_STACK as (typeof AUTH_STACK)[KEY]['NAME']]: undefined;
};

export const MAIN_BOTTOM_TAB = {
  HOME: {NAME: 'HomeScreen', TITLE: '홈 화면'},
  MEMBER: {NAME: 'MemberScreen', TITLE: '교인 화면'},
  VISITATION: {NAME: 'VisitationScreen', TITLE: '심방 화면'},
  EDUCATION: {NAME: 'EducationScreen', TITLE: '교육 화면'},
  TASK: {NAME: 'TaskScreen', TITLE: '업무 화면'},
  CALENDAR: {NAME: 'CalendarScreen', TITLE: '일정표 화면'},
} as const;

export type MainBottomTabParams = {
  [KEY in keyof typeof MAIN_BOTTOM_TAB as (typeof MAIN_BOTTOM_TAB)[KEY]['NAME']]: undefined;
};
