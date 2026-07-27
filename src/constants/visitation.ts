// 심방 상태/방식 라벨 + 배지 색. 웹(@mokjang/constants)의 STATUS/색상과 맞춘다.

export const VISITATION_STATUS_LABEL: Record<string, string> = {
  reserve: '예약',
  inProgress: '진행중',
  done: '완료',
  pending: '대기',
  completed: '완료',
  canceled: '취소',
};

export const VISITATION_METHOD_LABEL: Record<string, string> = {
  inPerson: '대면',
  remote: '비대면',
};

// {배경, 글자} 색. 웹 STATUS_BACKGROUND_COLOR / STATUS_FONT_COLOR 기준.
export const VISITATION_STATUS_COLOR: Record<
  string,
  {bg: string; text: string}
> = {
  reserve: {bg: '#E5E7EB', text: '#6B7280'},
  inProgress: {bg: '#DBEAFE', text: '#1A51CD'},
  done: {bg: '#D1FADF', text: '#1E6839'},
  completed: {bg: '#D1FADF', text: '#1E6839'},
  pending: {bg: '#FEF3C7', text: '#854D0F'},
  canceled: {bg: '#FEE2E2', text: '#B91C1C'},
};

export const statusLabel = (status?: string) =>
  (status && VISITATION_STATUS_LABEL[status]) || status || '-';

export const methodLabel = (method?: string) =>
  (method && VISITATION_METHOD_LABEL[method]) || method || '-';

export const statusColor = (status?: string) =>
  (status && VISITATION_STATUS_COLOR[status]) || {
    bg: '#E5E7EB',
    text: '#6B7280',
  };

// ISO 날짜/일시를 KST 기준으로 표시.
const kst = (iso: string) =>
  new Date(new Date(iso).getTime() + 9 * 3600 * 1000);

export const formatDate = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const k = kst(iso);
  const y = k.getUTCFullYear();
  const m = String(k.getUTCMonth() + 1).padStart(2, '0');
  const day = String(k.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const formatDateTime = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const k = kst(iso);
  const hh = String(k.getUTCHours()).padStart(2, '0');
  const mm = String(k.getUTCMinutes()).padStart(2, '0');
  return `${formatDate(iso)} ${hh}:${mm}`;
};
