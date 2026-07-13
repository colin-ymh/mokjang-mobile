import  {forwardRef, useMemo, useState} from 'react';
import {
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  StyleSheet,
  TextStyle,
} from 'react-native';

import {BLACK, MAIN} from '../../../../constants/style/color';

export type InputProps = TextInputProps & {
  label?: string;
  onKeyPress?: (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => void;
  editable?: boolean;
  height?: number;
  width?: number;
  color?: string;
  backgroundColor?: string;
  onPress?: (event: any) => void;
  borderBottomColor?: string;
};

const MainInput = forwardRef<TextInput, InputProps>(
  (
    {
      editable = false,
      value,
      height,
      width,
      color,
      backgroundColor,
      borderBottomColor,
      style,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const dynamicStyle = useMemo<TextStyle>(() => {
      const s: TextStyle = {
        width: width ?? '100%',
        height,
        color: color ?? BLACK,
        backgroundColor: backgroundColor ?? 'transparent',
      };

      // styled-components의 &:focus border-bottom 대체
      if (isFocused) {
        s.borderBottomWidth = 1;
        s.borderBottomColor = borderBottomColor ?? MAIN.DEFAULT;
      } else {
        // 필요하면 기본 borderBottom을 유지하고 싶을 때 여기에 추가 가능
        // s.borderBottomWidth = 0;
      }

      return s;
    }, [width, height, color, backgroundColor, isFocused, borderBottomColor]);

    return (
      <TextInput
        ref={ref}
        value={value}
        editable={editable}
        style={[styles.input, dynamicStyle, style]}
        onFocus={e => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={e => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
    );
  },
);

export default MainInput;

const styles = StyleSheet.create({
  input: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
});
