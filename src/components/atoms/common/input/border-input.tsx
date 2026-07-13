import {forwardRef, useMemo} from 'react';
import {StyleSheet, TextInput, TextInputProps, TextStyle} from 'react-native';

import {BLACK, GRAY, WHITE} from '../../../../constants/style/color';
import {BLANK} from '../../../../constants/common';

/**
 * RN TextInput에 맞춘 Props
 */
type BorderInputProps = TextInputProps & {
  readOnly?: boolean;
  borderColor?: string;
  height?: number;
  width?: number;
  backgroundColor?: string;
  editable?: boolean; // 기존 로직 유지(배경색 분기용)
  value?: string;
};

/**
 * React Native에서 forwardRef로 TextInput 참조
 * - styled-components 제거
 * - pointerEvents는 style이 아니라 props로 처리
 */
const BorderInput = forwardRef<TextInput, BorderInputProps>(
  (
    {
      readOnly = false,
      borderColor = GRAY.DEFAULT,
      value = BLANK,
      height,
      width,
      editable = false,
      backgroundColor = WHITE,
      style,
      ...props
    },
    ref,
  ) => {
    const inputStyle = useMemo<TextStyle>(() => {
      return {
        width: width ?? '100%',
        height, // undefined면 자동 높이
        borderColor,
        backgroundColor: editable ? GRAY.LIGHT : backgroundColor,
      };
    }, [width, height, borderColor, editable, backgroundColor]);

    return (
      <TextInput
        ref={ref}
        value={value}
        editable={!readOnly}
        pointerEvents={!readOnly ? 'auto' : 'none'}
        style={[styles.input, inputStyle, style]}
        {...props}
      />
    );
  },
);

BorderInput.displayName = 'BorderInput';

export default BorderInput;

const styles = StyleSheet.create({
  input: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 5,
    color: BLACK,
  },
});
