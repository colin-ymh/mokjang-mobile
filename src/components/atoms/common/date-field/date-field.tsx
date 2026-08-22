import {useState} from 'react';
import {Platform, Pressable, StyleSheet} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {MainText} from '../text/main-text';
import {GRAY} from '../../../../constants/style/color';

type DateFieldProps = {
  value: Date;
  mode: 'date' | 'time';
  onChange: (date: Date) => void;
};

const formatYMD = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatHM = (date: Date) => {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

// 날짜/시간 단일 필드. iOS는 컴팩트 네이티브 피커, Android는 버튼+다이얼로그.
const DateField = ({value, mode, onChange}: DateFieldProps) => {
  const [open, setOpen] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setOpen(false);
    if (event.type === 'dismissed' || !selected) return;
    onChange(selected);
  };

  if (Platform.OS === 'ios') {
    return (
      <DateTimePicker
        value={value}
        mode={mode}
        display="compact"
        onChange={handleChange}
      />
    );
  }

  return (
    <>
      <Pressable style={styles.input} onPress={() => setOpen(true)}>
        <MainText fontSize={15} color={GRAY.EXTRA_DARK}>
          {mode === 'date' ? formatYMD(value) : formatHM(value)}
        </MainText>
      </Pressable>
      {open ? (
        <DateTimePicker
          value={value}
          mode={mode}
          display="default"
          onChange={handleChange}
        />
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: GRAY.LIGHT,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});

export default DateField;
