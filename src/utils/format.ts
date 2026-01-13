import {BLANK, LOCALE} from '../constants/common';

export const getTrimmedString = (value: string) => {
  if (!value) return BLANK;
  return value.trim();
};

// 2회 이상 연속 공백 불가
export const getFormattedName = (value: string) => {
  // 처음 공백 제거
  let trimmedValue = value.trimStart();

  // 2회 이상의 연속 공백을 단일 공백으로 치환
  trimmedValue = trimmedValue.replace(/\s{2,}/g, ' ');

  // 특수문자 및 숫자 제거 (한글과 영문만 허용)
  trimmedValue = trimmedValue.replace(/[^a-zA-Z가-힣ㄱ-ㅎ\s]/g, '');

  return trimmedValue;
};

export const getFormattedTitle = (value: string) => {
  // 처음 공백 제거
  let trimmedValue = value.trimStart();

  // 2회 이상의 연속 공백을 단일 공백으로 치환
  trimmedValue = trimmedValue.replace(/\s{2,}/g, ' ');

  // 특수문자 제거 (한글, 영문, 숫자 허용)
  trimmedValue = trimmedValue.replace(/[^a-zA-Z가-힣ㄱ-ㅎ0-9\s]/g, '');

  return trimmedValue;
};

// 휴대폰 번호 string을 010-xxxx-xxxx 형식으로 포맷
export const getFormattedMobilePhone = (mobilePhone: string) => {
  // 숫자만 남기기
  const cleaned = mobilePhone.replace(/\D/g, '');

  // 전화번호가 너무 긴 경우, 잘라내기
  const lengthLimit = 11;
  const limited = cleaned.slice(0, lengthLimit);

  // 각 구간에 하이픈(-) 추가
  if (limited.length < 4) {
    return limited;
  } else if (limited.length < 8) {
    return `${limited.slice(0, 3)}-${limited.slice(3)}`;
  } else {
    return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`;
  }
};

// 집 전화번호 string을 032-xxx-xxxx, 02-xxx-xxxx 형식으로 포맷
export const getFormattedHomePhone = (homePhone: string) => {
  // 숫자만 남기기
  const cleaned = homePhone.replace(/\D/g, '');

  // 앞자리가 02 일때
  if (cleaned.slice(0, 2) === '02') {
    const lengthLimit = 9;
    const limited = cleaned.slice(0, lengthLimit);

    if (limited.length < 3) {
      return limited;
    } else if (limited.length < 6) {
      return `${limited.slice(0, 2)}-${limited.slice(2)}`;
    } else {
      return `${limited.slice(0, 2)}-${limited.slice(2, 5)}-${limited.slice(5)}`;
    }
  }
  // 앞자리가 세자리일 때 (예: 032-xxx-xxxx)
  else {
    const lengthLimit = 10;
    const limited = cleaned.slice(0, lengthLimit);

    // 각 구간에 하이픈(-) 추가
    if (limited.length < 4) {
      return limited;
    } else if (limited.length < 7) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
    }
  }
};

// 생년월일 string을 YYYY-MM-DD 형식으로 포맷
export const getFormattedDate = (date: string) => {
  // 숫자만 남기기
  const cleaned = date.replace(/\D/g, ''); // 숫자 외 제거

  // 최대 8자리까지 자르기 (YYYYMMDD)
  const lengthLimit = 8;
  const limited = cleaned.slice(0, lengthLimit);

  // 포맷 적용
  if (limited.length < 5) {
    return limited; // 4자리 이하 (YYYY)
  } else if (limited.length < 7) {
    return `${limited.slice(0, 4)}-${limited.slice(4)}`; // 5~6자리 (YYYY-MM)
  } else {
    return `${limited.slice(0, 4)}-${limited.slice(4, 6)}-${limited.slice(6)}`; // 7~8자리 (YYYY-MM-DD)
  }
};

const getEnglishMonthName = (month: number): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[month - 1];
};

// YYYY-MM-DD 을 YYYY년 MM월 DD일 형식으로 포맷
export const getLocaleDateFromDashDate = (
  basePath: LOCALE,
  date: string,
): string => {
  if (!date) return ''; // 빈 입력 처리

  // YYYY-MM-DD에서 숫자만 남기기
  const cleaned = date.replace(/[^0-9]/g, ''); // 숫자 외 제거

  if (basePath === LOCALE.KO) {
    // 입력된 문자열 길이 확인 후 포맷 적용
    switch (cleaned.length) {
      case 4: // YYYY
        return `${cleaned}년`;
      case 6: // YYYY MM
        return `${cleaned.slice(0, 4)}년 ${parseInt(cleaned.slice(4, 6), 10)}월`;
      case 8: // YYYY MM DD
        return `${cleaned.slice(0, 4)}년 ${parseInt(cleaned.slice(4, 6), 10)}월 ${parseInt(cleaned.slice(6), 10)}일`;
      default: // 유효하지 않은 경우
        return '';
    }
  } else {
    switch (cleaned.length) {
      case 4: // YYYY
        return cleaned; // 연도만 반환
      case 6: // YYYY MM
        return `${getEnglishMonthName(parseInt(cleaned.slice(4, 6), 10))} ${cleaned.slice(0, 4)}`;
      case 8: // YYYY MM DD
        return `${getEnglishMonthName(parseInt(cleaned.slice(4, 6), 10))} ${parseInt(cleaned.slice(6), 10)}, ${cleaned.slice(0, 4)}`;
      default: // 유효하지 않은 경우
        return '';
    }
  }
};

// 차량번호 입력창 포맷
export const getFormattedVehicleNumber = (vehicleNumber: string) => {
  if (!vehicleNumber) return ''; // 입력값이 비어 있을 경우 공백 반환

  // 숫자만 남기기
  const cleaned = vehicleNumber.replace(/\D/g, ''); // 숫자 외 제거

  // 최대 4자리로 제한
  const lengthLimit = 4;
  return cleaned.slice(0, lengthLimit);
};
