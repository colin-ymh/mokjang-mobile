import {BLANK} from '../constants/common';

/**
 * YYYY-MM-dd => Date Object
 * @param dateString
 */
export const getDateFromString = (dateString: string | null) => {
  if (!dateString) return null;

  const lengthLimit = 10;
  const limited = dateString.slice(0, lengthLimit);

  if (limited.length === 10) return new Date(limited);
  else return null;
};

/**
 * Date Object => YYYY-MM-dd
 * @param date
 */
export const getStringFromDate = (date: Date | null) => {
  if (!date) return BLANK;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based index이므로 +1
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * 사용자의 생년월일 date object를 통해 미성년자인지 확인
 * @param date
 * @return {boolean}
 */
export const getIsChild = (date: Date | null): boolean => {
  if (!date) {
    return false;
  }

  const CURRENT_YEAR = new Date().getFullYear();
  const TARGET_YEAR = date.getFullYear();

  return CURRENT_YEAR - TARGET_YEAR <= 18;
};

export const getAge = (date: Date | null): number => {
  if (date === null) return 0;

  const today = new Date();
  const birthDate = new Date(date); // 입력된 날짜를 Date 객체로 변환

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // 생일이 지나지 않았으면 나이를 1살 줄임
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * 한 달 전의 날짜를 "YYYY-MM-DD" 문자열로 반환
 */
export const getNewMemberDate = (): string => {
  const today = new Date();
  // 현재 달에서 -1
  today.setMonth(today.getMonth() - 1);

  const year = today.getFullYear();
  // JS Date의 month는 0부터 시작하므로 +1
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  // yyyy-mm-dd 형태로 반환
  return `${year}-${month}-${day}`;
};

/**
 * second 를 mm:ss 형식으로 변경
 */
export const getMinuteFromSecond = (target: number) => {
  const minute = String(Math.floor(target / 60)).padStart(2, '0');
  const second = String(target % 60).padStart(2, '0');

  return `${minute}:${second}`;
};
