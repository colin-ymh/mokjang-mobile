import React, {forwardRef} from 'react';
import {
  TextInput,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import styled from 'styled-components/native';

import {BLACK, MAIN} from '../../../../constants/style/color';

const MainInputContainer = styled.TextInput<{
  ref?: React.ForwardedRef<TextInput>;
  $width?: number;
  $height?: number;
  $color?: string;
  $backgroundColor?: string;
  $borderBottomColor?: string;
  $isEditable?: boolean;
}>`
  width: ${({$width}) => ($width ? `${$width}px` : '100%')};
  font-size: 14px;
  padding: 12px 16px;
  height: ${({$height}) => ($height ? `${$height}px` : 'auto')};
  color: ${({$color}) => $color || BLACK};
  background-color: ${({$backgroundColor}) => $backgroundColor || 'auto'};
  position: relative;

  &:focus {
    border-bottom: ${({$borderBottomColor}) =>
      `1px solid ${$borderBottomColor || MAIN.DEFAULT}`};
  }
`;

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
      ...props
    },
    ref,
  ) => {
    return (
      <MainInputContainer
        ref={ref}
        value={value}
        $height={height}
        $width={width}
        $color={color}
        $backgroundColor={backgroundColor}
        $borderBottomColor={borderBottomColor}
        $isEditable={editable}
        editable={editable}
        {...props}
      />
    );
  },
);

export default MainInput;
