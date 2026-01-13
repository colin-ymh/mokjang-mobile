'use client'; // Next.js 13+ Client Component 표시 (React Native 환경이라면 보통 무의미하긴 합니다)

import React, {forwardRef} from 'react';
import styled from 'styled-components/native';
import {TextInput, TextInputProps} from 'react-native';
import {BLACK, GRAY, WHITE} from '../../../../constants/style/color';
import {BLANK} from '../../../../constants/common';

/**
 * React Native용 styled TextInput
 * - 웹 전용 속성(transition, box-sizing, outline, :focus 등) 제거
 * - borderWidth, borderColor, pointerEvents 등 RN 속성 사용
 */
const BorderInputContainer = styled.TextInput<{
  ref?: React.ForwardedRef<TextInput>;
  $isEditable: boolean;
  $borderColor: string;
  height?: number;
  width?: number;
  $editable?: boolean;
  $backgroundColor?: string;
}>`
  /* 폭/높이를 px 단위 문자열로 쓰거나, 그냥 숫자로만 전달해도 무방합니다. */
  width: ${({width}) => (width ? `${width}px` : '100%')};
  height: ${({height}) => (height ? `${height}px` : 'auto')};

  font-size: 14px;
  padding: 10px 15px;
  border-width: 1px;
  border-color: ${({$borderColor}) => $borderColor};
  border-radius: 5px;
  color: ${BLACK};

  /* pointer-events: "auto" or "none" in RN */
  pointer-events: ${({$isEditable}) => ($isEditable ? 'auto' : 'none')};

  /* RN에선 배경색은 background-color 대신 backgroundColor입니다만,
       styled-components/native는 이 문자열 방식도 내부적으로 처리해줍니다. */
  background-color: ${({$editable, $backgroundColor}) =>
    $editable ? GRAY.LIGHT : $backgroundColor || WHITE};
`;

/**
 * RN TextInput에 맞춘 Props
 * (InputProps가 웹 전용이라면 충돌이 날 수 있으니, 꼭 RN에 맞춘 필드만 사용)
 */
type BorderInputProps = TextInputProps & {
  readOnly?: boolean;
  borderColor?: string;
  height?: number;
  width?: number;
  backgroundColor?: string;
  editable?: boolean;
  value?: string;
};

/**
 * React Native에서 forwardRef로 TextInput 참조
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
      ...props
    },
    ref,
  ) => {
    return (
      <BorderInputContainer
        ref={ref}
        // React Native TextInput 관련
        value={value}
        editable={!readOnly} // readOnly -> editable={false}
        // 스타일용
        $isEditable={!readOnly}
        $borderColor={borderColor}
        $backgroundColor={backgroundColor}
        height={height}
        width={width}
        $editable={editable}
        // 나머지 props (onChangeText, placeholder 등)
        {...props}
      />
    );
  },
);

BorderInput.displayName = 'BorderInput';

export default BorderInput;
