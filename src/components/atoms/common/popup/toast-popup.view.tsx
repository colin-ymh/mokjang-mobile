import React from 'react';
import {Animated, Pressable, Text} from 'react-native';
import styled from 'styled-components/native';

import {FONT_WEIGHT} from '../../../../constants/style/style';
import {WHITE} from '../../../../constants/style/color';

export enum TOAST_DIRECTION {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

type ToastPopupViewProps = {
  text: string;
  backgroundColor: string;
  isDeletable: boolean;
  fontSize: number;
  fontWeight: FONT_WEIGHT;
  color: string;
  direction: TOAST_DIRECTION;
  // Animated.View 스타일 (top/bottom, opacity 등)
  containerStyle: any;
  onClickDeleteButton: () => void;
};

const Wrapper = styled.View<{direction: TOAST_DIRECTION}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: ${({direction}) =>
    direction === TOAST_DIRECTION.TOP ? 'flex-start' : 'flex-end'};
  align-items: center;
`;

const Container = styled(Animated.View)<{$bgColor: string}>`
  position: absolute;
  left: 30px;
  right: 30px;
  height: 40px;
  bottom: 30px;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  background-color: ${({$bgColor}) => $bgColor};
`;

const CloseButton = styled(Pressable)`
  margin-top: 5px;
`;

export default function ToastPopupView({
  text,
  backgroundColor,
  isDeletable,
  fontSize,
  fontWeight,
  color,
  containerStyle,
  onClickDeleteButton,
  direction,
}: ToastPopupViewProps) {
  return (
    <Wrapper direction={direction} pointerEvents="none">
      <Container
        pointerEvents="auto"
        style={containerStyle}
        $bgColor={backgroundColor}>
        <Text style={{color, fontSize, fontWeight}}>{text}</Text>
        {isDeletable && (
          <CloseButton onPress={onClickDeleteButton}>
            <Text style={{color: WHITE}}>X</Text>
          </CloseButton>
        )}
      </Container>
    </Wrapper>
  );
}
