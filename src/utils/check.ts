import {BLANK} from '../constants/common';

export const getIsWellFormedMobilePhone = (mobilePhone: string) => {
  if (mobilePhone.slice(0, 3) !== '010') return false;

  return mobilePhone.length === 13;
};

const LOCAL_NUMBER = ['02', '03', '04', '05', '06'];
export const getIsWellFormedHomePhone = (mobilePhone: string) => {
  const FIRST_TWO = mobilePhone.slice(0, 2);
  const LENGTH = mobilePhone.length;

  // 지역번호가 틀리면 바로 false
  if (!LOCAL_NUMBER.includes(FIRST_TWO)) return false;

  // 서울 + 11자리 => true
  if (FIRST_TWO === '02' && LENGTH === 11) return true;

  // 그 외 + 12자리 => true
  // 나머지는 false
  return FIRST_TWO !== '02' && LENGTH === 12;
};

const THIRTY_ONE_MONTHS = new Set(['1', '3', '5', '7', '8', '10', '12']);
const THIRTY_MONTHS = new Set(['4', '6', '9', '11']);

export const getIsWellFormedBirth = (birth: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth)) return false; // YYYY-MM-DD 형식 검사

  const [YEAR, MONTH, DATE] = birth.split('-').map(v => parseInt(v, 10));
  const TODAY = new Date();

  // 연도 검사
  if (YEAR > TODAY.getFullYear()) return false;
  if (YEAR === TODAY.getFullYear() && MONTH > TODAY.getMonth() + 1)
    return false;
  if (
    YEAR === TODAY.getFullYear() &&
    MONTH <= TODAY.getMonth() + 1 &&
    DATE > TODAY.getDate()
  )
    return false;

  // 월 검사
  if (MONTH < 1 || MONTH > 12) return false;

  // 일 검사
  if (DATE < 1) return false;

  if (THIRTY_ONE_MONTHS.has(MONTH.toString()) && DATE > 31) return false;
  if (THIRTY_MONTHS.has(MONTH.toString()) && DATE > 30) return false;

  // 2월 검사
  if (MONTH === 2) {
    // 윤년 여부
    const isLeapYear = (YEAR % 4 === 0 && YEAR % 100 !== 0) || YEAR % 400 === 0;
    if (DATE > (isLeapYear ? 29 : 28)) return false;
  }

  return true;
};

export const getIsWellFormedDate = (birth: string): boolean => {
  // YYYY-MM-DD 형식 검사
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth)) return false;

  const [YEAR, MONTH, DATE] = birth.split('-').map(v => parseInt(v, 10));

  // 월 검사 (1 ~ 12 범위)
  if (MONTH < 1 || MONTH > 12) return false;

  // 윤년 여부 검사 함수
  const isLeapYear = (year: number): boolean =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  // 각 월별 최대 일자
  const daysInMonth = [
    31,
    isLeapYear(YEAR) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  // 일 검사 (월별 최대 일자 범위 내에 있어야 함)
  if (DATE < 1 || DATE > daysInMonth[MONTH - 1]) return false;

  return true;
};

export const getIsWellFormedName = (name: string) => {
  if (name === BLANK) return false;
  // 한글, 영문, 공백만 허용
  return /^[가-힣a-zA-Z\s]+$/g.test(name);
};

export const getIsWellFormedTitle = (name: string) => {
  if (name === BLANK) return false;
  // 한글, 영문, 공백만 허용
  return /^[가-힣a-zA-Z0-9\s]+$/g.test(name);
};

export const getIsWellFormedVehicleNumber = (vehicleNumber: string) => {
  if (vehicleNumber.length !== 4) return false;
  return true;
};
