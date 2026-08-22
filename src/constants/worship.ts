// 예배 요일 / 출석 상태 라벨 + 배지 색. 웹(@mokjang/constants)의 라벨과 맞춘다.

const WEEKDAY_LABEL = [
  '주일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
];

export const weekdayLabel = (worshipDay?: number) =>
  typeof worshipDay === 'number' && WEEKDAY_LABEL[worshipDay]
    ? WEEKDAY_LABEL[worshipDay]
    : '-';

export const ATTENDANCE_STATUS_LABEL: Record<string, string> = {
  unknown: '미정',
  present: '출석',
  absent: '결석',
};

export const ATTENDANCE_STATUS_COLOR: Record<
  string,
  {bg: string; text: string}
> = {
  unknown: {bg: '#E5E7EB', text: '#6B7280'},
  present: {bg: '#D1FADF', text: '#1E6839'},
  absent: {bg: '#FEE2E2', text: '#B91C1C'},
};

export const attendanceStatusLabel = (status?: string) =>
  (status && ATTENDANCE_STATUS_LABEL[status]) || '미정';

export const attendanceStatusColor = (status?: string) =>
  (status && ATTENDANCE_STATUS_COLOR[status]) ||
  ATTENDANCE_STATUS_COLOR.unknown;

// 다음 상태로 순환: 미정 -> 출석 -> 결석 -> 미정
export const nextAttendanceStatus = (
  status?: string,
): 'unknown' | 'present' | 'absent' => {
  if (status === 'unknown' || !status) return 'present';
  if (status === 'present') return 'absent';
  return 'unknown';
};
